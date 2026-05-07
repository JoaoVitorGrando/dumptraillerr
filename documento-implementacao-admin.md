# Documento de Implementacao - Aba Admin (FAGU)

## Objetivo

Implementar uma aba/painel administrativo robusto para operacao da plataforma FAGU, com controle global de:

- disponibilidade de trailers por data;
- conflitos de reserva;
- metricas de negocio;
- aprovacao de perfis operacionais (owner/driver);
- monitoramento de pagamentos e status de booking.

Este documento foi escrito para execucao por agente de codigo (Claude/Codex), com foco em implementacao incremental, validavel e sem quebrar fluxos existentes.

---

## Escopo da Entrega (Admin)

### Inclui

1. Login e autorizacao admin-only.
2. Dashboard admin com metricas reais.
3. Tela de disponibilidade global da frota.
4. Gestao de bookings (aprovar, confirmar, cancelar, resolver conflito).
5. Gestao de frota (status do trailer: available/rented/maintenance).
6. Gestao de usuarios operacionais (owner/driver pendente/aprovado/suspenso).
7. Trilha basica de auditoria (acoes administrativas).

### Nao inclui nesta fase

- PWA do driver.
- BI avancado (coortes, churn, LTV completo).
- Integracoes externas alem de Stripe/Supabase existentes.
- Automacao de roteirizacao.

---

## Regras de Negocio Criticas

1. Nunca confirmar reserva sem disponibilidade real.
2. Reserva concorrente para mesmo trailer+data nao pode passar.
3. Booking cria estado `PENDING` antes do pagamento.
4. Pagamento confirmado via webhook muda para `CONFIRMED`.
5. Booking `PENDING` expira e libera slot (TTL, ex.: 15 minutos) se nao pago.
6. Admin pode bloquear trailer manualmente por janela de data (manutencao/indisponibilidade).

---

## Arquitetura de Acesso (RBAC)

## Perfis

- `customer`: apenas dados proprios.
- `owner`: apenas frota e dados proprios.
- `driver`: apenas jobs e dados proprios.
- `admin`: visao global.

## Enforco

1. **Middleware**: bloquear acesso indevido por role.
2. **Server-side guards** em paginas admin.
3. **Queries filtradas por role** (nunca confiar no frontend).

---

## Rotas Admin (propostas)

- `/admin` -> resumo executivo (KPIs + alertas).
- `/admin/bookings` -> tabela global de reservas, filtros e acoes.
- `/admin/fleet` -> todos os trailers e status.
- `/admin/availability` -> calendario global de disponibilidade por trailer.
- `/admin/users` -> aprovacao/suspensao de owner/driver.
- `/admin/payments` -> status de pagamentos Stripe.
- `/admin/audit` -> log de acoes administrativas.

---

## Modelo de Dados (base existente + ajustes)

A base no `prisma/schema.prisma` ja contem modelos relevantes:

- `User`, `OwnerProfile`, `DriverProfile`, `CustomerProfile`
- `Trailer`, `TrailerAvailability`
- `Booking`, `Payment`
- `AuditLog`

## Ajustes recomendados

1. Garantir relacao de booking com intervalo claro:
   - `serviceDate` + `pickupDate` (ou `blockedUntil`) consistente.
2. Adicionar indice para busca por disponibilidade:
   - `Booking(trailerId, serviceDate, status)`
   - `TrailerAvailability(trailerId, blockedFrom, blockedUntil)`
3. Se necessario, adicionar `expiresAt` em `Booking` para `PENDING`.

---

## Fluxo Seguro de Reserva (obrigatorio)

1. Cliente escolhe trailer + data.
2. API valida conflito em transacao.
3. Cria `Booking PENDING` com `expiresAt`.
4. Cria Stripe Checkout Session.
5. Webhook `checkout.session.completed`:
   - marca pagamento como `PAID`;
   - muda booking para `CONFIRMED`.
6. Job de expiracao:
   - `PENDING` vencido -> `CANCELLED` + libera disponibilidade.

---

## Telas e Funcionalidades Admin

## 1) Dashboard (`/admin`)

KPIs minimos:

- bookings hoje;
- bookings confirmadas;
- ocupacao da frota (%);
- receita do periodo;
- pagamentos pendentes/falhos;
- owners pendentes;
- drivers pendentes.

Widgets:

- grafico simples por dia (ultimos 7/30 dias);
- lista de alertas (conflitos, expiracoes, manutencao).

## 2) Bookings (`/admin/bookings`)

Tabela com:

- id booking;
- cliente;
- trailer;
- datas;
- status booking;
- status pagamento;
- valor.

Acoes:

- confirmar;
- cancelar;
- marcar em progresso;
- concluir;
- abrir detalhe da reserva.

Filtros:

- status;
- intervalo de data;
- trailer;
- cidade.

## 3) Fleet (`/admin/fleet`)

Lista global com:

- trailer;
- owner;
- status atual;
- proxima disponibilidade.

Acoes:

- alterar status (`AVAILABLE`, `RENTED`, `MAINTENANCE`);
- bloquear periodo;
- remover bloqueio.

## 4) Availability (`/admin/availability`)

Visao de calendario por trailer:

- blocos de booking confirmado;
- blocos de booking pendente;
- blocos de manutencao manual.

Acoes:

- criar bloqueio manual;
- editar/remover bloqueio;
- resolver conflito (com recomendacao de realocacao).

## 5) Users (`/admin/users`)

Gerenciar `owner` e `driver`:

- pendente;
- ativo/aprovado;
- suspenso.

Acoes:

- aprovar;
- suspender;
- reativar.

## 6) Payments (`/admin/payments`)

Lista de pagamentos:

- bookingId;
- stripeSessionId/paymentIntentId;
- valor;
- status.

Acoes:

- reprocessar sincronizacao;
- marcar para revisao manual.

## 7) Audit (`/admin/audit`)

Registro de acao administrativa:

- ator (admin);
- acao;
- entidade;
- data;
- payload basico.

---

## Seguranca e Validacoes

1. Admin-only em middleware e server components.
2. Validacao server-side de todas as mutacoes.
3. Nunca usar dados sensiveis no cliente sem necessidade.
4. Idempotencia no webhook Stripe.
5. Sanitizacao e validacao de entrada (zod).

---

## Plano de Implementacao (fases curtas)

## Fase A - Fundacao Admin + RBAC (1-2 dias)

- reforcar middleware para admin-only;
- revisar `/admin/layout` com guard server-side;
- padronizar redirecionamentos.

## Fase B - Bookings + Disponibilidade Segura (2-4 dias)

- ajuste fluxo `PENDING -> CONFIRMED`;
- checagem de conflito em transacao;
- pagina `/admin/bookings` com filtros e acoes basicas.

## Fase C - Fleet + Availability Calendar (2-4 dias)

- `/admin/fleet`;
- `/admin/availability`;
- bloqueios manuais de trailer.

## Fase D - Users + Payments + Audit (2-3 dias)

- aprovacao de owner/driver;
- painel de pagamentos;
- logs de auditoria.

## Fase E - Hardening e QA (1-2 dias)

- testes de autorizacao por role;
- teste de concorrencia de booking;
- testes webhook + expiracao;
- validação manual de ponta a ponta.

---

## Criterios de Aceite

1. Usuario nao-admin nao acessa `/admin/*`.
2. Admin visualiza todos os trailers e disponibilidade por data.
3. Nao e possivel confirmar duas reservas conflitantes para o mesmo trailer.
4. Booking so fica `CONFIRMED` apos webhook de pagamento.
5. Booking `PENDING` vencido e liberado automaticamente.
6. Admin consegue aprovar/suspender owner/driver.
7. Dashboard admin mostra KPIs reais sem dados demo.

---

## Checklist para o Agente de Codigo

1. Implementar guard completo de admin no middleware e layouts.
2. Substituir qualquer dependencia de demo dentro de `/admin/*`.
3. Criar servico central de disponibilidade:
   - `checkTrailerAvailability(trailerId, from, to)`
4. Integrar checkout + webhook ao estado de booking.
5. Adicionar telas admin listadas acima.
6. Adicionar testes basicos (unitarios/integracao) para conflito de data.
7. Entregar com comandos de validacao (lint/build/test).

---

## Observacoes finais

- A estrutura atual do projeto ja permite evoluir para isso sem refatoracao radical.
- O ponto mais importante para operacao e a consistencia de disponibilidade em transacao.
- Comecar por `Bookings + Availability` traz maior reducao de risco de negocio imediatamente.

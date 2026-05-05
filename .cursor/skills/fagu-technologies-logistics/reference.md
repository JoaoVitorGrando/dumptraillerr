# Fagu Technologies & Logistics

## Documento Executivo Técnico

**Projeto:** Fagu Dump Trailer Rental System  
**Data:** 26 de abril de 2026

## Brand Book 2026 — Identidade Visual (Belisa Design)

### Atributos da marca

- Líder
- Confiável
- Moderna
- Criativa

### Propósito de marca

Conectar clientes diretamente com prestadores de serviço, reduzindo custo para clientes e melhorando remuneração de prestadores.

### Tipografia oficial

- **ALTA**: tipografia principal para títulos.
- **ZALANDO**: tipografia de apoio para comunicação e tom de voz.

### Paleta oficial

| Nome | HEX | Uso recomendado |
|---|---|---|
| Autoridade | `#3E3E3E` | Base escura, texto principal, contraste |
| Urbano | `#979797` | Texto secundário, estados neutros |
| Horizonte | `#E2E2E2` | Fundos suaves, divisórias |
| Fluxo | `#EB7231` | CTA primária, destaque e ação |
| Ascensão | `#FFFFFF` | Base clara, respiro visual |
| Fundamento | `#D75227` | Hover/ênfase forte, variação de destaque |

### Diretrizes práticas de aplicação

- Usar **Fluxo** como cor de ação primária e **Fundamento** para estados de ênfase.
- Usar **Autoridade** como base de leitura e estrutura.
- Garantir consistência visual entre componentes, páginas e materiais.
- Evitar inclusão de novas cores fora da paleta oficial sem justificativa.
- Priorizar equilíbrio entre identidade forte e legibilidade em todos os breakpoints.

## 1) Resumo Executivo

Plataforma transacional para aluguel de dump trailers integrando:

- Owner (frota e receita);
- Driver (execucao operacional);
- Customer (reserva e pagamento);
- Admin Fagu (governanca da plataforma).

Meta principal atualizada:

- MVP funcional em **12 a 16 semanas**;
- desenvolvimento por **um unico desenvolvedor**;
- qualidade tecnica como requisito inegociavel;
- construcao em **vertical slices** com validacao por fase;
- foco no ciclo que gera receita: Reserva -> Pagamento -> Entrega -> Avaliacao.

## 2) Personas e Fluxos Operacionais

- **Owner:** gerencia trailers, disponibilidade, calendario, faturamento e depositos.
- **Driver:** executa coleta/entrega/devolucao via fluxo mobile com fotos e assinatura.
- **Customer:** reserva, paga, acompanha status e avalia servico.
- **Admin (Fagu):** aprova cadastros, monitora saude do sistema e resolve excecoes.

## 3) Escopo Tecnico do MVP

### 3.1 Capabilidades essenciais

1. Cadastro e KYC de Owner/Driver/Customer com aprovacao.
2. Catalogo de trailers e disponibilidade por periodo.
3. Reserva com prevencao de conflitos.
4. Pagamento Stripe com webhook idempotente e retry.
5. Execucao operacional com evidencias (foto/assinatura).
6. Integracao GoHighLevel para comunicacao e pipeline.
7. Painel administrativo com auditoria e controles globais.

### 3.2 Itens explicitamente adiados para v1.0

1. Stripe Connect para split automatico.
2. GPS continuo em tempo real.
3. Marketplace aberto de drivers.
4. App nativo iOS/Android.
5. Otimizacao automatica de rotas.
6. Inteligencia preditiva de demanda e preco.

## 4) Stack Tecnologica Consolidada

- **App Web:** Next.js 15 + TypeScript
- **Banco:** Supabase PostgreSQL com RLS
- **ORM:** Prisma
- **Auth e Storage:** Supabase Auth + Storage
- **Pagamentos:** Stripe Checkout + Webhooks
- **CRM:** GoHighLevel API + Webhooks
- **Mapas:** Mapbox/Google Maps
- **Deploy e monitoramento:** Vercel + Sentry

## 5) Roadmap Oficial (Solo Developer)

### Fase 0 (Semana 1) — Fundacao tecnica
- setup de projeto, banco, autenticacao base, deploy e observabilidade.

### Fase 1 (Semanas 2-3) — Cadastros e KYC
- onboarding por perfil, upload de documentos e integracao inicial com GHL.

### Fase 2 (Semanas 4-5) — Reservas + Stripe
- catalogo, bloqueio anti-conflito, checkout e confirmacao de pagamento.

### Fase 3 (Semanas 6-7) — Dashboard Owner
- gestao de frota, calendario e visao financeira.

### Fase 4 (Semanas 8-9) — App Driver (PWA)
- jobs mobile, fotos, assinatura e status em campo.

### Fase 5 (Semanas 10-11) — Portal Cliente + ciclo GHL
- area do cliente, historico/faturas e sincronizacao bidirecional com GHL.

### Fase 6 (Semanas 12-13) — Admin + Hardening
- painel admin, trilha de auditoria, testes E2E e revisao de seguranca/performance.

### Fase 7 (Semanas 14-16) — Go-live e estabilizacao
- producao, suporte inicial, ajustes por uso real e documentacao final.

## 6) Riscos e Mitigacoes

- **Pagamentos/webhooks:** risco de duplicidade ou perda de evento.  
  Mitigacao: idempotencia, retry controlado e rastreabilidade de eventos.

- **Isolamento de dados (RLS):** risco de exposicao entre tenants/perfis.  
  Mitigacao: politicas RLS por padrao + testes de autorizacao por perfil.

- **Integracoes externas:** indisponibilidade GHL/Stripe degradar operacao.  
  Mitigacao: filas, retentativas e observabilidade ativa.

- **Concorrencia de reservas:** risco de dupla alocacao no mesmo periodo.  
  Mitigacao: locks transacionais e validacao atomica de disponibilidade.

## 7) Requisitos Nao Funcionais

1. Confiabilidade dos fluxos criticos antes do go-live.
2. Seguranca de autenticacao, sessao e dados sensiveis.
3. Observabilidade com logs, alertas e monitoramento de incidentes.
4. Performance previsivel em operacao real.
5. Escalabilidade para crescimento ate 1.000 trailers.

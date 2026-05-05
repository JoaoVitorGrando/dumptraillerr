# Plano de Implementação — Fagu Dump Trailer Rental System

> **Contexto:** Landing page React/Vite já existe com front-end funcional e base de integração preparada (GoHighLevel + Stripe em modo demo). O sistema completo exige migração para Next.js 15 + TypeScript, banco Supabase, autenticação, pagamentos Stripe, portal do cliente, dashboard do owner, app do driver (PWA) e painel administrativo.
>
> **Estrutura do repositório:** pasta `platform/` criada dentro do repo atual para o projeto Next.js. A landing Vite permanece na raiz até a migração ser concluída.
>
> **Regra de ouro:** nunca avance para a próxima fase sem ter a fase atual funcionando em ambiente de desenvolvimento e commitada no repositório.

---

## Índice de Fases

| # | Fase | O que entrega |
|---|------|---------------|
| 0 | Fundação técnica | Projeto Next.js configurado, banco rodando, deploy base no ar |
| 1 | Credenciais e variáveis de ambiente | Todas as integrações prontas para receber chaves do cliente |
| 2 | Migração do front-end existente | Landing page Vite → Next.js sem perda de conteúdo ou estilo |
| 3 | Banco de dados e schema | Tabelas, RLS e migrations Prisma |
| 4 | Autenticação | Login/cadastro por perfil (Customer, Owner, Driver) |
| 5 | Catálogo e reservas | Listagem de trailers, bloqueio de datas, criação de booking |
| 6 | Pagamento Stripe | Checkout, webhook idempotente, confirmação de reserva |
| 7 | Integração GoHighLevel | Leads, pipeline de vendas, notificações automáticas |
| 8 | Dashboard do Owner | Frota, calendário, financeiro |
| 9 | App do Driver (PWA) | Jobs mobile, fotos, assinatura digital |
| 10 | Portal do Cliente | Reservas, histórico, faturas, avaliações |
| 11 | Painel Administrativo | Aprovações, auditoria, controles globais |
| 12 | Hardening e testes | Segurança, performance, testes E2E |
| 13 | Go-live | Deploy final, monitoramento, documentação |

---

## Fase 0 — Fundação Técnica

> **Objetivo:** ter a estrutura mínima do projeto Next.js funcionando com banco conectado e deploy vazio no ar. Tudo o que vier depois depende disso.

### 0.1 — Criar o projeto Next.js dentro de `platform/`

- [ ] Na raiz do repositório, criar a pasta e inicializar:
  ```bash
  mkdir platform && cd platform
  npx create-next-app@latest . --typescript --tailwind --app --src-dir
  ```
- [ ] Confirmar que o roteador é o App Router (`src/app/`)
- [ ] Instalar dependências base:
  ```bash
  npm install @prisma/client @supabase/supabase-js stripe @stripe/stripe-js zod react-hook-form
  npm install -D prisma @types/node
  ```
- [ ] Configurar `eslint` + `prettier` com regras do projeto
- [ ] Criar `platform/.gitignore` (incluir `.env*`, `node_modules`, `.next`)
- [ ] Confirmar estrutura final do repo:
  ```
  / (raiz)              ← landing Vite (atual)
  /platform/            ← plataforma Next.js (novo)
  planoimplementação.md
  configurações.md
  README.md
  ```

### 0.2 — Configurar Supabase

> **Aguarda:** URL do projeto Supabase + `SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` (cliente fornece)

- [ ] Criar `platform/.env.local` com as variáveis:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  DATABASE_URL=        # connection string do Supabase (Pooler — Transaction mode)
  ```
- [ ] Criar `src/lib/supabase/client.ts` (cliente browser)
- [ ] Criar `src/lib/supabase/server.ts` (cliente server-side com service role)
- [ ] Verificar conexão com um query de teste

### 0.3 — Configurar Prisma

- [ ] Dentro de `platform/`, rodar: `npx prisma init --datasource-provider postgresql`
- [ ] Apontar `DATABASE_URL` para a connection string do Supabase (Pooler — Transaction mode para Serverless)
- [ ] Criar `schema.prisma` base com apenas o modelo `User` para testar a connection
- [ ] Rodar `npx prisma db push` e confirmar que a tabela aparece no Supabase
- [ ] Rodar `npx prisma studio` e verificar a tabela visualmente
- [ ] Adicionar `prisma generate` ao script de build no `package.json`

### 0.4 — Deploy no Vercel

> **Aguarda:** acesso ao Vercel do cliente (ou criar novo projeto)

- [ ] Conectar repositório ao Vercel
- [ ] Configurar no Vercel: `Root Directory = platform`
- [ ] Configurar variáveis de ambiente no painel do Vercel (mesmas do `.env.local`)
- [ ] Fazer primeiro deploy e confirmar que a URL está acessível
- [ ] Ativar proteção de branch (não deployar `main` sem PR aprovado)

### 0.5 — Configurar Sentry

> **Aguarda:** DSN do Sentry (criar projeto no sentry.io se o cliente não tiver)

- [ ] Instalar: `npm install @sentry/nextjs`
- [ ] Rodar `npx @sentry/wizard@latest -i nextjs`
- [ ] Adicionar `SENTRY_DSN` ao `.env.local` e ao Vercel
- [ ] Testar: lançar erro manual e verificar se aparece no painel do Sentry

---

## Fase 1 — Credenciais e Variáveis de Ambiente

> **Objetivo:** consolidar em um único lugar todas as integrações que dependem do cliente, para que o desenvolvimento nunca trave por falta de chave.

### 1.1 — Checklist de credenciais a solicitar ao cliente

Entregar esta lista ao cliente e só avançar para a Fase 2 quando todas as marcadas com ⚠️ estiverem disponíveis:

| Integração | Variável | Prioridade |
|---|---|---|
| Supabase URL | `NEXT_PUBLIC_SUPABASE_URL` | ⚠️ Bloqueante |
| Supabase Anon Key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ Bloqueante |
| Supabase Service Role | `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Bloqueante |
| Supabase DB Connection String | `DATABASE_URL` | ⚠️ Bloqueante |
| Stripe Publishable Key | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Fase 6 |
| Stripe Secret Key | `STRIPE_SECRET_KEY` | Fase 6 |
| Stripe Webhook Secret | `STRIPE_WEBHOOK_SECRET` | Fase 6 |
| GHL Webhook — Booking | `NEXT_PUBLIC_GHL_BOOKING_WEBHOOK` | Fase 7 |
| GHL Webhook — Owner Signup | `NEXT_PUBLIC_GHL_OWNER_WEBHOOK` | Fase 7 |
| GHL Webhook — Customer Signup | `NEXT_PUBLIC_GHL_CUSTOMER_WEBHOOK` | Fase 7 |
| GHL Webhook — Driver Signup | `NEXT_PUBLIC_GHL_DRIVER_WEBHOOK` | Fase 7 |
| GHL Webhook — Contact | `NEXT_PUBLIC_GHL_CONTACT_WEBHOOK` | Fase 7 |
| GHL API Key | `GHL_API_KEY` | Fase 7 |
| Google Maps / Mapbox Key | `NEXT_PUBLIC_MAPS_KEY` | Fase 8 |
| Sentry DSN | `SENTRY_DSN` | Fase 0 |

### 1.2 — Criar arquivo de configuração central

- [ ] Criar `src/config/env.ts` que centraliza e valida todas as variáveis com Zod:
  ```typescript
  // Valida no startup: se variável obrigatória faltar, o app joga erro claro
  import { z } from "zod"
  const envSchema = z.object({ ... })
  export const env = envSchema.parse(process.env)
  ```
- [ ] Nenhum outro arquivo do projeto deve ler `process.env` diretamente — tudo passa por `env.ts`

---

## Fase 2 — Migração do Front-end Existente

> **Objetivo:** mover a landing page atual (Vite/React) para o Next.js sem perder nenhum conteúdo, estilo ou funcionalidade existente.

### 2.1 — Migrar assets e estilos

- [ ] Copiar `src/assets/` para `public/assets/` no projeto Next.js (imagens otimizadas com `next/image`)
- [ ] Copiar `tailwind.config.js` e garantir que as cores customizadas da brand (`brand-orange`, `brand-dark`, `brand-yellow`, `brand-light`) estão definidas
- [ ] Copiar `src/index.css` para `src/app/globals.css`
- [ ] Verificar que fontes e classes utilitárias funcionam igual ao projeto original

### 2.2 — Migrar componentes

- [ ] Criar pasta `src/components/` e migrar cada componente:
  - `Header.jsx` → `Header.tsx`
  - `Footer.jsx` → `Footer.tsx`
  - `Hero.jsx` → `Hero.tsx`
  - `Benefits.jsx` → `Benefits.tsx`
  - `HowItWorks.jsx` → `HowItWorks.tsx`
  - `ServicesCarousel.jsx` → `ServicesCarousel.tsx`
  - `Trailers.jsx` → `Trailers.tsx`
  - `TrailerCard.jsx` → `TrailerCard.tsx`
  - `BookingForm.jsx` → `BookingForm.tsx` (marcar como `"use client"`)
  - `Payment.jsx` → `Payment.tsx` (marcar como `"use client"`)
  - `FAQ.jsx` → `FAQ.tsx`
  - `Rules.jsx` → `Rules.tsx`
  - `Partner.jsx` → `Partner.tsx`
  - `PartnerTeaser.jsx` → `PartnerTeaser.tsx`
  - `FinalCTA.jsx` → `FinalCTA.tsx`
  - `FaguBadge.jsx` → `FaguBadge.tsx`
- [ ] Adicionar tipagem TypeScript a todos os props de componentes

### 2.3 — Migrar dados e serviços

- [ ] Copiar `src/data/trailers.js` → `src/data/trailers.ts` com tipos
- [ ] Copiar `src/data/services.js` → `src/data/services.ts` com tipos
- [ ] Migrar `src/config/api.js` → `src/config/api.ts` (adaptado para usar `env.ts`)
- [ ] Migrar `src/services/leads.js` → `src/services/leads.ts`

### 2.4 — Migrar páginas

- [ ] `HomePage` → `src/app/page.tsx`
- [ ] `ServicePage` → `src/app/services/[slug]/page.tsx`
- [ ] `PartnerPage` → `src/app/partner/[[...role]]/page.tsx`
- [ ] `FAQPage` → `src/app/faq/page.tsx`
- [ ] `ContactPage` → `src/app/contact/page.tsx`
- [ ] `DumpTrailerPage` → `src/app/dump-trailer/page.tsx`
- [ ] Configurar `src/app/layout.tsx` com `<Header />` e `<Footer />` globais

### 2.5 — Verificação final da migração

- [ ] Rodar `npm run build` sem erros
- [ ] Navegar por todas as rotas em `localhost:3000` e comparar com o Vite original
- [ ] Verificar responsividade em mobile (375px), tablet (768px) e desktop (1280px)
- [ ] Confirmar que o formulário de booking ainda valida e exibe modo demo corretamente
- [ ] Commit: `feat: migrate landing page from Vite to Next.js`

---

## Fase 3 — Banco de Dados e Schema

> **Objetivo:** definir toda a estrutura de dados do sistema em Prisma, com RLS habilitado no Supabase para isolamento entre perfis.

### 3.1 — Modelar o schema Prisma

Criar os seguintes modelos em `prisma/schema.prisma`:

- [ ] **User** — id, email, phone, role (CUSTOMER | OWNER | DRIVER | ADMIN), status (PENDING | ACTIVE | SUSPENDED), createdAt
- [ ] **OwnerProfile** — userId, companyName, taxId, documentUrl, approvedAt
- [ ] **DriverProfile** — userId, licenseNumber, licenseExpiry, documentUrl, approvedAt
- [ ] **CustomerProfile** — userId, preferredAddress
- [ ] **Trailer** — id, ownerId, name, slug, size, capacity, gvwr, payload, pricePerPeriod, status (AVAILABLE | RENTED | MAINTENANCE), images[]
- [ ] **TrailerAvailability** — trailerId, blockedFrom, blockedUntil, reason
- [ ] **Booking** — id, customerId, trailerId, driverId, status (PENDING | CONFIRMED | IN_PROGRESS | COMPLETED | CANCELLED), deliveryAddress, serviceDate, deliveryWindow, materialType, totalAmount, loads
- [ ] **Payment** — id, bookingId, stripePaymentIntentId, stripeCheckoutSessionId, amount, status (PENDING | PAID | REFUNDED | FAILED), paidAt
- [ ] **OperationalEvent** — id, bookingId, driverId, type (PICKUP | DELIVERY | RETURN), photoUrls[], signatureUrl, lat, lng, createdAt
- [ ] **Review** — id, bookingId, customerId, rating, comment, createdAt
- [ ] **AuditLog** — id, actorId, action, entity, entityId, payload, createdAt

### 3.2 — Migrations e deploy do schema

- [ ] Rodar `npx prisma migrate dev --name initial_schema`
- [ ] Verificar no painel do Supabase que todas as tabelas foram criadas
- [ ] Rodar `npx prisma db seed` com dados de teste (pelo menos 5 trailers do catálogo existente)

### 3.3 — Configurar Row Level Security (RLS) no Supabase

- [ ] Habilitar RLS em todas as tabelas via SQL no Supabase
- [ ] Criar política: Customer só lê os próprios Bookings e Payments
- [ ] Criar política: Owner só lê/edita os próprios Trailers e vê Bookings relacionados
- [ ] Criar política: Driver só vê os OperationalEvents e Bookings atribuídos a ele
- [ ] Criar política: Admin tem acesso irrestrito via service role
- [ ] Testar cada política com um usuário mockado de cada perfil

### 3.4 — Criar índices de performance

- [ ] Índice em `Booking.serviceDate`
- [ ] Índice em `Trailer.status`
- [ ] Índice em `TrailerAvailability.blockedFrom` + `blockedUntil`
- [ ] Índice em `Payment.stripePaymentIntentId` (unique)

---

## Fase 4 — Autenticação

> **Objetivo:** login e cadastro por perfil (Customer, Owner, Driver) usando Supabase Auth, com fluxo de aprovação para Owner e Driver.

### 4.1 — Configurar Supabase Auth

- [ ] Habilitar email/senha no painel do Supabase Auth
- [ ] Configurar redirect URLs no Supabase (localhost e domínio de produção)
- [ ] Instalar middleware Next.js para proteger rotas privadas (`src/middleware.ts`)
- [ ] Criar `src/lib/auth.ts` com funções: `signUp`, `signIn`, `signOut`, `getSession`, `getCurrentUser`

### 4.2 — Páginas de autenticação

- [ ] `/auth/signup` — seletor de perfil (Customer, Owner, Driver) → formulário específico
- [ ] `/auth/login` — email + senha, redirecionamento por perfil após login
- [ ] `/auth/forgot-password` — recuperação via email
- [ ] `/auth/callback` — rota de retorno do Supabase Auth (magic link / OAuth futuro)

### 4.3 — Formulários de cadastro por perfil

**Customer:**
- [ ] Campos: nome, email, telefone, endereço
- [ ] Ao submeter: criar User + CustomerProfile no banco via Server Action
- [ ] Enviar lead ao GHL (webhook `customer_signup`)

**Owner:**
- [ ] Campos: nome, empresa, Tax ID, telefone, email, upload de documento
- [ ] Ao submeter: criar User + OwnerProfile com status `PENDING`
- [ ] Notificar Admin (via GHL ou email) para aprovação
- [ ] Enviar lead ao GHL (webhook `owner_signup`)

**Driver:**
- [ ] Campos: nome, telefone, email, número da habilitação, validade, upload de documento
- [ ] Ao submeter: criar User + DriverProfile com status `PENDING`
- [ ] Notificar Admin para aprovação
- [ ] Enviar lead ao GHL (webhook `driver_signup`)

### 4.4 — Proteção de rotas

- [ ] Criar `src/middleware.ts` com regras:
  - `/dashboard/owner/*` → apenas usuários com role OWNER e status ACTIVE
  - `/dashboard/driver/*` → apenas usuários com role DRIVER e status ACTIVE
  - `/dashboard/customer/*` → apenas usuários com role CUSTOMER e status ACTIVE
  - `/admin/*` → apenas usuários com role ADMIN
  - Não autenticado → redirecionar para `/auth/login`

### 4.5 — Verificação

- [ ] Criar conta Customer e logar → deve chegar no portal do cliente
- [ ] Criar conta Owner (deve ficar com status PENDING até Admin aprovar)
- [ ] Tentar acessar rota protegida sem login → deve redirecionar para login
- [ ] Fazer logout → sessão deve ser destruída

---

## Fase 5 — Catálogo de Trailers e Reservas

> **Objetivo:** Customer pode ver trailers disponíveis, selecionar datas e criar uma reserva, com validação de conflito de disponibilidade.

### 5.1 — API de trailers

- [ ] Criar Server Action `getTrailers()` — busca todos os trailers com status AVAILABLE
- [ ] Criar Server Action `getTrailerAvailability(trailerId, month)` — retorna datas bloqueadas
- [ ] Criar Server Action `checkAvailability(trailerId, date)` — verifica se a data está livre (sem conflito)

### 5.2 — Atualizar o BookingForm

- [ ] Substituir a lista estática de `trailers.ts` por dados reais do banco
- [ ] Integrar calendário de disponibilidade: datas bloqueadas aparecem desabilitadas
- [ ] Ao selecionar data, chamar `checkAvailability` em tempo real
- [ ] Validação de conflito deve ocorrer também no server-side (Server Action) antes de criar o booking

### 5.3 — Criar reserva (Server Action)

- [ ] Criar `createBooking(formData)`:
  1. Validar dados com Zod
  2. Verificar disponibilidade da data de forma atômica (transaction Prisma)
  3. Bloquear a data em `TrailerAvailability`
  4. Criar registro `Booking` com status `PENDING`
  5. Retornar `bookingId` para redirecionar ao pagamento
- [ ] Em caso de conflito de data: retornar erro claro para o usuário
- [ ] Adicionar `AuditLog` na criação da reserva

### 5.4 — Verificação

- [ ] Criar duas reservas para o mesmo trailer na mesma data → segunda deve ser rejeitada
- [ ] Confirmar que o `Booking` é criado com status `PENDING` no banco
- [ ] Confirmar que a data fica bloqueada no calendário imediatamente

---

## Fase 6 — Pagamento com Stripe

> **Objetivo:** Customer paga a reserva via Stripe Checkout, o webhook confirma o pagamento e a reserva muda de status.

> **Aguarda:** `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

### 6.1 — Configurar Stripe

- [ ] Criar produto e preço no Stripe Dashboard (ou via API) para "Dump Trailer Rental - $350"
- [ ] Adicionar as chaves ao `.env.local` e ao Vercel

### 6.2 — Criar Stripe Checkout Session

- [ ] Criar Route Handler `POST /api/stripe/checkout`:
  1. Receber `bookingId`
  2. Buscar `Booking` no banco e validar que pertence ao usuário logado
  3. Criar `Stripe Checkout Session` com:
     - `line_items`: descrição + valor do booking
     - `metadata.bookingId`: para rastrear no webhook
     - `success_url`: `/booking/success?session_id={CHECKOUT_SESSION_ID}`
     - `cancel_url`: `/booking/cancelled`
  4. Criar registro `Payment` com status `PENDING` e `stripeCheckoutSessionId`
  5. Retornar `url` da sessão Stripe

### 6.3 — Webhook Stripe (crítico — idempotente)

- [ ] Criar Route Handler `POST /api/stripe/webhook`:
  1. Verificar assinatura com `stripe.webhooks.constructEvent` e `STRIPE_WEBHOOK_SECRET`
  2. Para evento `checkout.session.completed`:
     - Extrair `bookingId` dos metadados
     - Verificar se `Payment` já foi processado (idempotência pelo `stripeCheckoutSessionId`)
     - Atualizar `Payment.status` → `PAID`
     - Atualizar `Booking.status` → `CONFIRMED`
     - Enviar confirmação por email (via GHL ou Supabase email)
     - Registrar `AuditLog`
  3. Para evento `payment_intent.payment_failed`:
     - Atualizar `Payment.status` → `FAILED`
     - Atualizar `Booking.status` → `PENDING` (liberar data para nova tentativa)
- [ ] Configurar webhook no Stripe Dashboard apontando para a URL de produção

### 6.4 — Página de confirmação

- [ ] `/booking/success` — exibe resumo da reserva confirmada e próximos passos
- [ ] `/booking/cancelled` — informa que a reserva não foi concluída com opção de tentar novamente

### 6.5 — Atualizar o botão "Proceed to Payment"

- [ ] Botão no `BookingForm` após sucesso do formulário deve chamar o endpoint de checkout
- [ ] Redirecionar para a URL do Stripe Checkout

### 6.6 — Verificação

- [ ] Fazer booking completo com cartão de teste Stripe (`4242 4242 4242 4242`)
- [ ] Verificar que `Booking.status` muda para `CONFIRMED` após webhook
- [ ] Testar pagamento com falha (`4000 0000 0000 0002`) e confirmar que status volta para `PENDING`
- [ ] Testar que o mesmo webhook processado duas vezes não duplica atualizações (idempotência)

---

## Fase 7 — Integração GoHighLevel

> **Objetivo:** todos os leads e eventos do sistema são espelhados no GoHighLevel para automação de CRM, comunicação e pipeline de vendas.

> **Aguarda:** URLs dos webhooks GHL + `GHL_API_KEY`

### 7.1 — Validar webhooks existentes

- [ ] Configurar as variáveis de ambiente com os webhooks reais fornecidos pelo cliente
- [ ] Testar o serviço `leads.ts` existente com cada tipo de formulário:
  - `booking` → ao confirmar reserva
  - `owner_signup` → ao cadastrar Owner
  - `customer_signup` → ao cadastrar Customer
  - `driver_signup` → ao cadastrar Driver
  - `contact` → ao enviar formulário de contato

### 7.2 — Enriquecer payload dos leads

- [ ] Atualizar o payload enviado ao GHL para incluir:
  - `userId` do Supabase
  - `bookingId` (quando aplicável)
  - `paymentStatus`
  - UTM params (source, medium, campaign) se disponíveis na URL

### 7.3 — Notificações automáticas via GHL

Configurar as seguintes automações no GHL (workflow do cliente, não código):

- [ ] Novo Owner cadastrado → email de boas-vindas + notificação interna para aprovação
- [ ] Booking confirmado (pago) → email de confirmação para Customer com detalhes
- [ ] Booking atribuído ao Driver → SMS/email para Driver com endereço e hora
- [ ] Booking concluído → email de avaliação para Customer

### 7.4 — Verificação

- [ ] Submeter formulário de booking e confirmar que o contato aparece no GHL
- [ ] Confirmar que os campos mapeados chegam corretamente no CRM
- [ ] Verificar que as automações disparadas no GHL funcionam (pelo menos email de confirmação)

---

## Fase 8 — Dashboard do Owner

> **Objetivo:** Owner pode gerenciar sua frota, ver o calendário de reservas, adicionar/editar trailers e acompanhar faturamento.

### 8.1 — Layout do dashboard

- [ ] Criar `src/app/dashboard/owner/layout.tsx` com sidebar de navegação
- [ ] Sidebar: Visão Geral, Minha Frota, Calendário, Reservas, Financeiro, Configurações

### 8.2 — Página: Minha Frota

- [ ] Listar todos os trailers do Owner (filtrados por `ownerId` via RLS)
- [ ] Formulário para adicionar novo trailer: nome, tamanho, capacidade, GVWR, preço, fotos (upload para Supabase Storage)
- [ ] Editar trailer existente
- [ ] Alterar status do trailer (AVAILABLE / MAINTENANCE)

### 8.3 — Página: Calendário

- [ ] Calendário mensal mostrando dias com reservas confirmadas
- [ ] Visualização por trailer
- [ ] Clicar no dia abre detalhes da reserva
- [ ] Owner pode bloquear datas manualmente (criar `TrailerAvailability` com reason "owner_block")

### 8.4 — Página: Reservas

- [ ] Listar todos os bookings dos trailers do Owner (status, data, cliente, endereço)
- [ ] Detalhes da reserva: customer info, driver atribuído, eventos operacionais
- [ ] Owner pode atribuir um Driver a um booking com status `CONFIRMED`

### 8.5 — Página: Financeiro

- [ ] Resumo do mês: reservas concluídas, valor total, valor pendente
- [ ] Lista de pagamentos recebidos
- [ ] (Nota: integração com Stripe Connect para repasse automático é pós-MVP)

### 8.6 — Verificação

- [ ] Logar como Owner aprovado e navegar por todas as páginas
- [ ] Adicionar trailer e confirmar que aparece disponível para booking
- [ ] Bloquear uma data e confirmar que o calendário de booking reflete o bloqueio

---

## Fase 9 — App do Driver (PWA)

> **Objetivo:** Driver acessa via mobile browser (PWA) e executa o fluxo operacional: aceitar job, registrar pickup, tirar foto, coletar assinatura e registrar devolução.

### 9.1 — Configurar PWA

- [ ] Instalar `next-pwa` ou configurar Service Worker manualmente
- [ ] Criar `manifest.json` com ícone da FAGU, nome e tema
- [ ] Garantir que o app funciona offline para visualizar jobs já carregados

### 9.2 — Layout mobile-first

- [ ] Criar `src/app/dashboard/driver/layout.tsx` com nav bottom (mobile) e sidebar colapsável (tablet+)
- [ ] Todos os elementos com mínimo de 44px de área de toque
- [ ] Navbar: Jobs de Hoje, Histórico, Perfil

### 9.3 — Página: Jobs de Hoje

- [ ] Listar bookings do dia atribuídos ao Driver (status `CONFIRMED`)
- [ ] Card por booking: endereço, horário, tipo de material, trailer
- [ ] Botão "Iniciar Job" → muda Booking para `IN_PROGRESS`

### 9.4 — Fluxo operacional por job

- [ ] **Etapa 1 — Pickup:** Driver confirma coleta, tira foto do trailer antes do carregamento
- [ ] **Etapa 2 — Delivery:** Driver confirma entrega no endereço do cliente, tira foto
- [ ] **Etapa 3 — Assinatura:** Interface de assinatura digital do cliente no campo (`canvas`)
- [ ] **Etapa 4 — Return:** Driver registra devolução do trailer com foto final
- [ ] Cada etapa cria um registro `OperationalEvent` com foto (upload Supabase Storage), coordenadas GPS (browser Geolocation API) e timestamp
- [ ] Ao finalizar todas as etapas: Booking muda para `COMPLETED`

### 9.5 — Verificação

- [ ] Simular fluxo completo: aceitar job → pickup → delivery → assinatura → return
- [ ] Confirmar que fotos chegam no Supabase Storage
- [ ] Confirmar que `Booking.status` muda para `COMPLETED` ao final
- [ ] Testar em iOS Safari e Android Chrome (principais browsers mobile)

---

## Fase 10 — Portal do Cliente

> **Objetivo:** Customer tem uma área logada para ver reservas ativas, histórico, faturas e avaliar o serviço.

### 10.1 — Layout do portal

- [ ] Criar `src/app/dashboard/customer/layout.tsx`
- [ ] Menu: Minhas Reservas, Histórico, Avaliar Serviço, Meus Dados

### 10.2 — Página: Minhas Reservas

- [ ] Listar reservas ativas (PENDING, CONFIRMED, IN_PROGRESS) com status visual claro
- [ ] Card por reserva: trailer, data, endereço, status, valor
- [ ] Link para "Ver Contrato" — gera PDF do contrato de aluguel (modelo do PDF existente) com dados preenchidos

### 10.3 — Geração de contrato em PDF

- [ ] Usar `@react-pdf/renderer` ou `puppeteer` para gerar PDF do contrato
- [ ] Template baseado no contrato existente (`Contrato de Aluguel de dump trailers.pdf`)
- [ ] Preencher automaticamente: nome, endereço, datas, valor, tipo de trailer
- [ ] Disponibilizar para download via `/api/contracts/[bookingId]`

### 10.4 — Página: Histórico

- [ ] Listar reservas concluídas e canceladas
- [ ] Por reserva: data, trailer, valor pago, link para fatura, nota de avaliação (se já avaliou)

### 10.5 — Página: Avaliar Serviço

- [ ] Listar reservas COMPLETED sem avaliação
- [ ] Formulário: rating (1–5 estrelas) + comentário
- [ ] Criar `Review` no banco

### 10.6 — Verificação

- [ ] Fazer booking completo como Customer e verificar que aparece no portal
- [ ] Gerar PDF do contrato e verificar que os dados estão corretos
- [ ] Deixar avaliação e verificar que `Review` foi criada no banco

---

## Fase 11 — Painel Administrativo

> **Objetivo:** Admin da FAGU tem visão global do sistema, aprova cadastros, resolve exceções e acessa trilha de auditoria.

### 11.1 — Layout do admin

- [ ] Criar `src/app/admin/layout.tsx` (acesso apenas role ADMIN)
- [ ] Menu: Dashboard, Usuários, Trailers, Reservas, Pagamentos, Auditoria

### 11.2 — Página: Dashboard

- [ ] Cards de KPIs: reservas hoje, receita do mês, trailers ativos, usuários pendentes de aprovação
- [ ] Gráfico simples de reservas por semana (últimas 4 semanas)

### 11.3 — Página: Usuários

- [ ] Lista de todos os usuários com filtro por role e status
- [ ] Ação: **Aprovar** Owner/Driver (muda status para ACTIVE)
- [ ] Ação: **Suspender** usuário (muda status para SUSPENDED)
- [ ] Ver detalhes: documentos enviados, histórico de ações

### 11.4 — Página: Reservas

- [ ] Lista de todas as reservas com filtros (status, data, cliente, trailer)
- [ ] Admin pode cancelar uma reserva e iniciar reembolso (chama Stripe Refund API)
- [ ] Admin pode reatribuir Driver de uma reserva

### 11.5 — Página: Auditoria

- [ ] Lista do `AuditLog` com filtros por ator, entidade e período
- [ ] Detalhe de cada entrada com payload completo

### 11.6 — Verificação

- [ ] Aprovar um Owner e verificar que ele consegue logar no dashboard
- [ ] Cancelar uma reserva e verificar que o reembolso é iniciado no Stripe
- [ ] Verificar que cada ação gera entrada no `AuditLog`

---

## Fase 12 — Hardening, Segurança e Testes

> **Objetivo:** garantir que o sistema é seguro, estável e testável antes do go-live.

### 12.1 — Segurança

- [ ] Revisar todas as Server Actions: nenhuma confia em dados do cliente sem validação Zod server-side
- [ ] Confirmar que `SUPABASE_SERVICE_ROLE_KEY` nunca é exposta ao browser (não usar `NEXT_PUBLIC_`)
- [ ] Confirmar que o webhook Stripe valida a assinatura em 100% das chamadas
- [ ] Adicionar rate limiting nas rotas de auth (`/api/auth/*`) com `upstash/ratelimit` ou middleware
- [ ] Revisar RLS: testar com usuário de um perfil tentando acessar dados de outro
- [ ] Verificar que uploads de arquivo têm validação de tipo e tamanho máximo
- [ ] Configurar headers de segurança no `next.config.ts` (CSP, X-Frame-Options, etc.)

### 12.2 — Testes

- [ ] Instalar `vitest` + `@testing-library/react` para testes unitários
- [ ] Testes unitários para:
  - Validação do BookingForm (campos obrigatórios, email, telefone)
  - Lógica de cálculo de preço no Summary
  - `checkAvailability` (mock de banco)
  - Processamento do webhook Stripe (idempotência)
- [ ] Instalar `playwright` para testes E2E
- [ ] Testes E2E para os fluxos críticos:
  - Cadastro de Customer → booking → pagamento → confirmação
  - Cadastro de Owner → aprovação admin → adicionar trailer
  - Driver recebe job → executa fluxo operacional → booking concluído

### 12.3 — Performance

- [ ] Verificar pontuação no Lighthouse: meta ≥ 90 em Performance e Acessibilidade
- [ ] Garantir que imagens de trailers usam `next/image` com `width` e `height` definidos
- [ ] Verificar que páginas públicas (landing) fazem Static Generation (não SSR desnecessário)
- [ ] Confirmar que queries Prisma têm `select` explícito (não buscar campos desnecessários)

### 12.4 — Monitoramento

- [ ] Confirmar que erros de Server Actions chegam no Sentry
- [ ] Confirmar que erros do webhook Stripe chegam no Sentry
- [ ] Criar alerta no Sentry para erros críticos (payment failure, webhook error)

---

## Fase 13 — Go-Live

> **Objetivo:** colocar o sistema em produção com segurança, monitoramento ativo e documentação operacional.

### 13.1 — Preparação final

- [ ] Rodar `npm run build` sem warnings críticos
- [ ] Rodar todos os testes E2E contra o ambiente de staging
- [ ] Confirmar que todas as variáveis de ambiente de produção estão configuradas no Vercel
- [ ] Confirmar que o webhook Stripe está configurado com a URL de produção (não localhost)
- [ ] Apontar domínio customizado no Vercel e configurar HTTPS
- [ ] Configurar redirect `www` → `apex` (ou vice-versa)

### 13.2 — Deploy de produção

- [ ] Rodar `npx prisma migrate deploy` contra o banco de produção
- [ ] Fazer deploy via merge para branch `main` no Vercel
- [ ] Verificar que o deploy passou sem erros no log do Vercel

### 13.3 — Smoke tests pós-deploy

- [ ] Acessar a landing page no domínio de produção
- [ ] Fazer booking completo com cartão de teste Stripe em produção (depois deletar)
- [ ] Verificar que o webhook Stripe recebeu o evento em produção
- [ ] Verificar que o email de confirmação chegou
- [ ] Logar como cada perfil (Customer, Owner, Driver, Admin) e verificar acesso

### 13.4 — Documentação operacional

- [ ] Criar `platform/docs/RUNBOOK.md` com:
  - Como rodar localmente
  - Como rodar migrations em produção
  - Como revogar/recriar chaves do Stripe e GHL
  - Como aprovar manualmente um Owner/Driver pelo banco (caso de emergência)
  - Onde ver logs de erro (Sentry + Vercel)

### 13.5 — Estabilização pós-launch

- [ ] Monitorar Sentry por 7 dias após launch para capturar erros reais
- [ ] Corrigir bugs reportados em produção (prioridade máxima)
- [ ] Coletar feedback do cliente sobre UX e criar lista de melhorias para v1.1

---

## Itens Fora do Escopo do MVP (pós-v1.0)

Estes itens estão documentados para não causar confusão durante o desenvolvimento:

- Stripe Connect (split automático entre FAGU e Owner)
- GPS em tempo real durante execução do job
- App nativo iOS/Android
- Otimização automática de rotas
- Inteligência preditiva de demanda e preço
- Marketplace aberto de drivers (sem aprovação manual)
- Multi-idioma (EN/PT)

---

## Checklist de Acesso Pendente do Cliente

> Use esta seção para controlar o que ainda precisa ser solicitado.

- [ ] Supabase: URL do projeto + Anon Key + Service Role Key + Connection String
- [ ] Stripe: Publishable Key + Secret Key + configurar Webhook no Dashboard
- [ ] GoHighLevel: URLs dos 5 webhooks + API Key para leitura bidirecional
- [ ] Google Maps ou Mapbox: API Key
- [ ] Sentry: criar projeto e fornecer DSN
- [ ] Vercel: acesso ao projeto ou criação de nova conta
- [ ] Domínio: configurar DNS ou conceder acesso ao registrador

---

*Documento gerado em 05 de maio de 2026. Atualizar à medida que o projeto avançar.*

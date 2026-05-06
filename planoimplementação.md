# Plano de Implementação — FAGU Dump Trailer Rental Platform

> **Última atualização:** 06 de maio de 2026
>
> **Estado atual:** 66 arquivos TypeScript criados em `platform/src/`. Todo o código UI/lógica está pronto. O sistema está em **modo demo** — funciona completamente sem credenciais externas. Basta fornecer as variáveis abaixo para ir ao ar.

---

## Resumo de Status

| Fase | Descrição | Status |
|------|-----------|--------|
| 0.1 | Projeto Next.js em `platform/` | ✅ Concluído |
| 0.2 | Configurar Supabase | ⏳ Aguarda credenciais |
| 0.3 | Configurar Prisma + migrations | ⏳ Aguarda credenciais |
| 0.4 | Deploy no Vercel | ⏳ Aguarda acesso |
| 0.5 | Sentry (monitoramento de erros) | ⏳ Aguarda DSN |
| 1 | Credenciais e variáveis de ambiente | ✅ env.ts pronto + checklist abaixo |
| 2 | Migração landing page Vite → Next.js | ✅ Concluído (15 componentes, 6 páginas) |
| 3 | Banco de dados e schema Prisma | ⏳ Schema escrito, aguarda DB para migrar |
| 4 | Autenticação (login, cadastro, proteção de rotas) | ✅ Concluído |
| 5 | Catálogo de trailers e reservas | ✅ UI pronta, conecta ao DB quando disponível |
| 6 | Stripe Checkout | ✅ UI/API prontos, aguarda `STRIPE_SECRET_KEY` |
| 7 | Integração GoHighLevel | ✅ Demo mode ativo, aguarda URLs reais |
| 8 | Owner Dashboard | ✅ Concluído |
| 9 | Driver PWA (fluxo de entrega 4 etapas) | ✅ Concluído |
| 10 | Portal do Cliente | ✅ Concluído |
| 11 | Painel Administrativo | ✅ Concluído |
| 12 | Hardening, segurança e testes | 🔜 Próxima etapa técnica |
| 13 | Go-live | 🔜 Após credenciais + testes |

---

## 🔑 O que é necessário agora (checklist do cliente)

Estas são as únicas coisas que bloqueiam o go-live. Tudo o mais já está construído.

### Bloqueantes imediatos — sem isso o sistema não funciona em produção

| Credencial | Variável no `.env.local` | Onde obter |
|---|---|---|
| Supabase URL | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| Supabase Anon Key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| Supabase Service Role Key | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| Supabase Connection String | `DATABASE_URL` | Supabase → Project Settings → Database → Connection Pooling (Transaction mode) |

### Pagamentos — sem isso não cobra nada

| Credencial | Variável | Onde obter |
|---|---|---|
| Stripe Secret Key | `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |
| Stripe Publishable Key | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys |
| Stripe Webhook Secret | `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → Reveal signing secret |

### CRM / Automações — sem isso os leads não chegam no GoHighLevel

| Credencial | Variável | Onde obter |
|---|---|---|
| GHL Webhook Booking | `NEXT_PUBLIC_GHL_BOOKING_WEBHOOK` | GHL → Automations → Webhook URL |
| GHL Webhook Owner | `NEXT_PUBLIC_GHL_OWNER_WEBHOOK` | GHL → Automations → Webhook URL |
| GHL Webhook Customer | `NEXT_PUBLIC_GHL_CUSTOMER_WEBHOOK` | GHL → Automations → Webhook URL |
| GHL Webhook Driver | `NEXT_PUBLIC_GHL_DRIVER_WEBHOOK` | GHL → Automations → Webhook URL |
| GHL Webhook Contato | `NEXT_PUBLIC_GHL_CONTACT_WEBHOOK` | GHL → Automations → Webhook URL |

### Deploy e monitoramento

| Credencial | Variável | Onde obter |
|---|---|---|
| URL pública do site | `NEXT_PUBLIC_SITE_URL` | Definir após configurar domínio |
| Sentry DSN | `SENTRY_DSN` | sentry.io → Settings → Projects → DSN |

---

## Arquivo `.env.local` — modelo completo

Criar o arquivo `platform/.env.local` com este conteúdo preenchido:

```env
# ── Supabase ──────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# ── Stripe ───────────────────────────────────────────
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# ── GoHighLevel ──────────────────────────────────────
NEXT_PUBLIC_GHL_BOOKING_WEBHOOK=
NEXT_PUBLIC_GHL_OWNER_WEBHOOK=
NEXT_PUBLIC_GHL_CUSTOMER_WEBHOOK=
NEXT_PUBLIC_GHL_DRIVER_WEBHOOK=
NEXT_PUBLIC_GHL_CONTACT_WEBHOOK=

# ── Site ─────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://seudominio.com
NEXT_PUBLIC_CONTACT_PHONE=+1 (206) 555-0199
NEXT_PUBLIC_CONTACT_EMAIL=hello@fagu.com
NEXT_PUBLIC_CONTACT_HOURS=Mon–Sat 7am–7pm PT

# ── Sentry (opcional mas recomendado) ────────────────
SENTRY_DSN=
```

---

## Próximos passos técnicos — em ordem de prioridade

### 1. Quando as credenciais Supabase chegarem

```bash
cd platform

# Instalar dependências
npm install

# Rodar migrations do banco (cria todas as 11 tabelas)
npx prisma migrate dev --name initial_schema

# Popular com dados iniciais
npx prisma db seed

# Iniciar em modo desenvolvimento
npm run dev
```

Depois disso:
- Acessar Supabase Dashboard → Authentication → URL Configuration
- Adicionar `http://localhost:3000/auth/callback` e `https://seudominio.com/auth/callback` em **Redirect URLs**
- Habilitar **Email confirmations** e **Secure email change**

### 2. Quando as credenciais Stripe chegarem

- Adicionar as 3 variáveis do Stripe no `.env.local`
- No Stripe Dashboard → Webhooks → Add endpoint:
  - URL: `https://seudominio.com/api/webhooks/stripe`
  - Eventos: `checkout.session.completed`, `payment_intent.payment_failed`
- Testar com cartão `4242 4242 4242 4242` (Stripe test mode)

### 3. Deploy no Vercel

```bash
# Na raiz do projeto
vercel --cwd platform
```

Ou via GitHub:
- Vercel Dashboard → New Project → Import repo
- **Root Directory:** `platform`
- Adicionar todas as variáveis de ambiente no painel do Vercel
- Branch `main` → produção automática

### 4. Fase 12 — Testes e Hardening (pode começar agora)

Itens que podem ser feitos sem credenciais:

- [ ] Adicionar `vitest` + testes unitários para validação do BookingForm
- [ ] Adicionar `playwright` + testes E2E para fluxos críticos
- [ ] Configurar headers de segurança no `next.config.ts` (CSP, X-Frame-Options)
- [ ] Adicionar `next/image` nas imagens principais (performance)
- [ ] Adicionar PWA manifest para o Driver app (`manifest.json` + service worker)
- [ ] Revisar acessibilidade (aria-labels, contraste, foco visível)

---

## O que foi construído — visão geral técnica

### Estrutura de arquivos (`platform/src/`)

```
app/
├── auth/
│   ├── layout.tsx              ← layout centralizado
│   ├── login/page.tsx          ← senha + magic link, redirectTo
│   ├── signup/page.tsx         ← 2 etapas: role picker + dados
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── callback/route.ts       ← troca code por sessão
│   └── signout/route.ts        ← POST → desloga + redirect
│
├── dashboard/
│   ├── layout.tsx              ← sidebar role-aware (server component)
│   ├── customer/
│   │   ├── page.tsx            ← overview com stats
│   │   ├── bookings/page.tsx   ← lista completa de reservas
│   │   ├── book/page.tsx       ← formulário de nova reserva
│   │   └── profile/page.tsx    ← editar nome/telefone
│   ├── owner/
│   │   ├── page.tsx            ← overview com receita e frota
│   │   ├── fleet/page.tsx      ← lista de trailers
│   │   ├── fleet/new/page.tsx  ← adicionar trailer
│   │   ├── availability/page.tsx ← calendário interativo
│   │   ├── earnings/page.tsx   ← gráfico mensal + por trailer
│   │   └── profile/page.tsx
│   └── driver/
│       ├── page.tsx            ← jobs do dia
│       ├── job/[id]/page.tsx   ← fluxo 4 etapas (client route)
│       ├── history/page.tsx
│       ├── earnings/page.tsx
│       └── profile/page.tsx
│
├── admin/
│   ├── layout.tsx              ← sidebar admin (role=admin only)
│   ├── page.tsx                ← KPIs + alertas de aprovação
│   ├── users/page.tsx          ← aprovação/rejeição de owners e drivers
│   ├── bookings/page.tsx       ← gestão completa de bookings
│   └── fleet/page.tsx          ← controle de status da frota
│
├── api/
│   ├── checkout/route.ts       ← POST → cria Stripe session (demo mode sem chave)
│   └── webhooks/stripe/route.ts ← verifica assinatura + processa eventos
│
├── booking/
│   ├── success/page.tsx        ← confirmação de pagamento
│   └── cancelled/page.tsx      ← pagamento cancelado
│
├── services/[slug]/page.tsx    ← dump trailer (full) + outros (coming soon)
├── partner/[role]/page.tsx     ← owner/customer/driver
├── contact/page.tsx
├── faq/page.tsx
├── layout.tsx                  ← root com Header + Footer
└── page.tsx                    ← homepage

components/
├── driver/DeliveryFlow.tsx     ← fluxo 4 etapas com câmera + canvas signature
├── BookingForm.tsx             ← formulário completo + Stripe redirect
├── Header.tsx, Footer.tsx, Hero.tsx, ...  ← 15 componentes da landing

data/
├── demo.ts                     ← mock data compartilhado (substitui Supabase)
├── trailers.ts                 ← 5 trailers com preços e imagens
└── services.ts                 ← 11 categorias de serviço

lib/supabase/
├── client.ts                   ← browser client (use client components)
└── server.ts                   ← server client + admin client

config/
├── env.ts                      ← validação Zod de todas as variáveis
└── api.ts                      ← config centralizada de contato e webhooks
```

### Padrões adotados

- **Server Components por padrão** — `"use client"` apenas quando usa hooks/eventos (13 de 66 arquivos)
- **Demo mode automático** — sem credenciais, tudo funciona com dados mock; com credenciais, conecta instantaneamente
- **Stripe dinâmico** — `await import("stripe")` evita erro de build sem a chave
- **Split Supabase client/server** — browser usa `client.ts`, servidor usa `server.ts` (nunca misturado)
- **Dados em cents** — todos os valores monetários armazenados como inteiros em cents

---

## Itens fora do escopo do MVP (pós-v1.0)

- Stripe Connect (split automático de receita entre FAGU e Owner)
- GPS em tempo real durante execução do job
- App nativo iOS/Android
- Otimização automática de rotas de entrega
- Marketplace aberto de drivers (sem aprovação manual)
- Multi-idioma (EN/PT)
- Geração automática de contratos em PDF

---

*Atualizado em 06 de maio de 2026.*

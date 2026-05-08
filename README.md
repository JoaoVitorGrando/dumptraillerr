# FAGU · Trailer Rental Platform

> **Status:** MVP em produção · Seattle, WA · 2026
> **Stack:** Next.js 15 · TypeScript · Supabase (Postgres) · Prisma · Stripe · Tailwind

---

## 1. O que é

FAGU é uma plataforma multi-papel de aluguel de trailers para o mercado de Seattle. Conecta:

- **Customers** — alugam trailers (foco MVP: dump trailers para construção, jardinagem, limpeza).
- **Owners (dealers)** — donos de trailers que cadastram a frota e ganham por aluguel.
- **Drivers** — motoristas FAGU que entregam e retiram trailers.
- **Admin** — operação interna que monitora bookings, frota, pagamentos e aprovações.

Reservas são instantâneas: o cliente escolhe trailer e datas, o sistema confere disponibilidade em transação, e o pagamento é capturado via Stripe Checkout antes da confirmação. Webhook do Stripe muda o booking de `PENDING` para `CONFIRMED`.

## 2. Estrutura do repositório

```
.
├── platform/                  # APP de produção (Next.js + Prisma)
│   ├── prisma/                # schema + migrations + seed
│   ├── public/                # assets estáticos
│   ├── src/
│   │   ├── app/               # rotas (App Router)
│   │   │   ├── admin/         # painel admin (RBAC: ADMIN)
│   │   │   ├── dashboard/     # painéis customer/owner/driver
│   │   │   ├── api/           # endpoints (admin, owner, checkout, webhooks)
│   │   │   ├── auth/          # login, signup, callback, signout
│   │   │   └── (públicas)     # landing, services, partner, faq, contact
│   │   ├── components/        # UI compartilhada (Header, Hero, BookingForm, Shells)
│   │   ├── data/              # catálogos estáticos (services, trailers, demo)
│   │   ├── lib/               # adapters: prisma, supabase, availability, auth admin
│   │   ├── middleware.ts      # auth + RBAC por rota
│   │   └── types/             # tipos TS compartilhados
│   ├── tailwind.config.ts
│   └── package.json
├── docs/                      # documentação técnica e operacional
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md          # (planejado)
│   ├── RUNBOOK.md             # (planejado)
│   └── BOOKING_FLOW.md        # (planejado)
├── README.md                  # este arquivo
├── planoimplementação.md      # roadmap de produto
└── documento-implementacao-admin.md
```

## 3. Pré-requisitos

- **Node.js** 20+
- **npm** 10+
- Conta **Supabase** (Postgres gerenciado + Auth)
- Conta **Stripe** (modo teste para dev, live para produção)
- (Opcional) **GoHighLevel** para captura de leads

## 4. Como rodar local

```bash
cd platform

# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp ../.env.example .env.local
# edite .env.local com suas chaves

# 3. Aplicar schema no banco
npx prisma migrate dev

# 4. Gerar Prisma Client
npx prisma generate

# 5. (Opcional) Popular dados demo
npx prisma db seed

# 6. Subir servidor
npm run dev
```

App em `http://localhost:3000`.

## 5. Variáveis de ambiente essenciais

| Var | Quem usa | Obrigatória |
|---|---|---|
| `DATABASE_URL` | Prisma client (pooler Supabase) | ✅ |
| `DIRECT_URL` | Prisma migrate (direta, sem pooler) | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth client + server | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth client | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Operações admin (server-only) | ✅ |
| `STRIPE_SECRET_KEY` | API de checkout | ✅ produção |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js no client | ✅ produção |
| `STRIPE_WEBHOOK_SECRET` | Validar webhook `checkout.session.completed` | ✅ produção |
| `NEXT_PUBLIC_GHL_*_WEBHOOK` | Disparar leads para GoHighLevel | opcional |
| `NEXT_PUBLIC_MAPS_KEY` | Geocoding/autocomplete de endereço | opcional |
| `SENTRY_DSN` | Monitoramento de erros | recomendado em produção |
| `NEXT_PUBLIC_CONTACT_PHONE` / `EMAIL` / `HOURS` | Footer e contato | recomendado |

> **Dica:** o sistema funciona em "modo demo" sem `STRIPE_SECRET_KEY` (cria booking direto como `CONFIRMED` para QA visual). Em produção é obrigatório.

## 6. Comandos úteis

```bash
# Dev
npm run dev                    # servidor local com hot reload

# Banco
npx prisma migrate dev         # cria migration + aplica
npx prisma migrate deploy      # aplica migrations em produção
npx prisma studio              # GUI para inspecionar dados
npx prisma db seed             # popula dados de exemplo

# Build & lint
npm run build                  # build de produção (inclui prisma generate)
npm run start                  # serve build de produção
npm run lint                   # ESLint
npm run format                 # Prettier write
npm run format:check           # Prettier check (CI)

# Type check (sem build)
npx tsc --noEmit -p tsconfig.json
```

## 7. Deploy

**Recomendado: Vercel + Supabase**

1. Conecte o repositório no Vercel apontando para `platform/` como root.
2. Configure todas as env vars da Seção 5 no painel do Vercel.
3. Configure o webhook do Stripe apontando para `https://SEU_DOMINIO/api/webhooks/stripe`.
4. Rode `npx prisma migrate deploy` antes do primeiro deploy (uma vez, no Supabase).
5. Habilite preview deploys para PRs (cada PR sobe um ambiente isolado).

**Setup Stripe:**

- Webhook eventos: `checkout.session.completed`, `payment_intent.payment_failed`.
- Endpoint: `POST /api/webhooks/stripe`.
- Copie o signing secret para `STRIPE_WEBHOOK_SECRET`.

## 8. Papéis e permissões

| Papel | Pode |
|---|---|
| `customer` | Reservar trailer, ver histórico, perfil |
| `owner` | Cadastrar trailer, definir disponibilidade, ver receita, **ligar/desligar reserva online por trailer** |
| `driver` | Ver jobs do dia, registrar entrega/retirada, histórico, ganhos |
| `admin` | Visão global: bookings, frota, usuários, pagamentos, audit log, aprovações |

Aplicação do RBAC:

- **Middleware** (`src/middleware.ts`) — bloqueia rotas por papel antes de chegar na page.
- **Server Components** — checagem dupla via `createClient()` do Supabase + `user.user_metadata.role`.
- **API routes admin** — `requireAdmin()` em `lib/adminAuth.ts` rejeita não-admins com 403.
- **Queries** — sempre filtradas por `userId` no servidor; nunca confiar em params do client.

## 9. Fluxo de booking (resumo)

```
Customer escolhe trailer + data
  └─> POST /api/checkout
        ├─ valida onlineBookingEnabled = true
        ├─ checkTrailerAvailability() em transação
        ├─ cria Booking PENDING + Payment PENDING (TTL 15min)
        └─ abre Stripe Checkout Session
              └─> Stripe redireciona para success_url
                    └─> webhook /api/webhooks/stripe (checkout.session.completed)
                          ├─ Payment → PAID
                          └─ Booking → CONFIRMED, expiresAt = null

Job de expiração (cron):
  └─ Bookings PENDING vencidos → CANCELLED + libera disponibilidade
```

Detalhes em `docs/BOOKING_FLOW.md`.

## 10. Owner toggle de reserva online

Cada trailer tem o flag `onlineBookingEnabled`. Quando o owner desliga:

- Trailer **some** das listagens públicas (`/services/dump-trailer`).
- `/api/checkout` rejeita reservas com erro 409 "Trailer not bookable online".
- Trailer continua aparecendo no `My Fleet` do owner (com indicador OFF).
- Bookings já confirmadas **não são canceladas** — só novas ficam bloqueadas.

Use case: owner quer alugar fora da plataforma temporariamente, evitando taxa, mantendo o trailer no inventário.

## 11. Escalabilidade — pontos sensíveis

- **Disponibilidade** — sempre calcular dentro de `prisma.$transaction()`. Existe índice composto em `Booking(trailerId, serviceDate, status)` e em `TrailerAvailability(trailerId, blockedFrom, blockedUntil)`.
- **Imagens** — hospedar em CDN (S3 + CloudFront ou Supabase Storage). Não servir do Postgres.
- **Webhook Stripe** — operações idempotentes via `stripeCheckoutSessionId @unique`. Rejeitar duplicatas.
- **Sessions Supabase** — pooler em modo *transaction*, conexões diretas só para migrate.
- **Audit log** — particionar por mês quando ultrapassar 1M de linhas.
- **Cron** — `expireStaleBookings()` deve rodar a cada minuto via Vercel Cron ou Supabase Edge Function.
- **Rate limiting** — adicionar middleware (Upstash) em `/api/checkout` antes de promoção.

## 12. Roadmap próximo

- [ ] Cron job de expiração de bookings PENDING (Vercel Cron)
- [ ] Notificações por e-mail (Resend) — confirmation, reminders, cancelamentos
- [ ] App mobile do driver (PWA)
- [ ] Integração Twilio para SMS no day-of-delivery
- [ ] BI: cohort de retenção, LTV, ocupação por região
- [ ] Liberar mais 10 categorias de trailer (já estruturadas, atrás da flag `SHOW_ONLY_DUMP_TRAILERS`)

## 13. Contato técnico

Para dúvidas operacionais ou bugs em produção, abra issue no repositório ou contate o time de engenharia FAGU.

---

© 2026 FAGU Home Services & Logistics — Seattle, WA

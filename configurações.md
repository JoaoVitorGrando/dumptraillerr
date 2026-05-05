# configurações — Fagu Dump Trailer Rental System

> Referência rápida de configurações práticas do projeto: variáveis de ambiente, identidade visual, regras de preço, integrações e dados de contato. Consulte durante o desenvolvimento para não precisar abrir outros arquivos.

---

## 1. Variáveis de Ambiente

Copie o bloco abaixo para `platform/.env.local` e preencha conforme o cliente fornecer os acessos.

```env
# ── Supabase ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=                        # Connection string (Pooler — Transaction mode)

# ── Stripe ────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=               # Gerado ao criar o webhook no Stripe Dashboard

# ── GoHighLevel ───────────────────────────────────────────────────────────────
NEXT_PUBLIC_GHL_BOOKING_WEBHOOK=
NEXT_PUBLIC_GHL_OWNER_WEBHOOK=
NEXT_PUBLIC_GHL_CUSTOMER_WEBHOOK=
NEXT_PUBLIC_GHL_DRIVER_WEBHOOK=
NEXT_PUBLIC_GHL_CONTACT_WEBHOOK=
GHL_API_KEY=                         # Para sync bidirecional (Fase 7)

# ── Mapas ─────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_MAPS_KEY=                # Google Maps ou Mapbox

# ── Monitoramento ─────────────────────────────────────────────────────────────
SENTRY_DSN=

# ── Contato público (fallback se não definido) ────────────────────────────────
NEXT_PUBLIC_CONTACT_PHONE=
NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_CONTACT_HOURS=
```

> **Regra:** nenhum arquivo do projeto lê `process.env` diretamente. Tudo passa por `src/config/env.ts` com validação Zod. Nunca use `NEXT_PUBLIC_` para chaves secretas.

---

## 2. Identidade Visual

### Paleta oficial (Brand Book 2026 — Belisa Design)

| Token | Nome | HEX | Uso |
|---|---|---|---|
| `brand-orange` | Fluxo | `#EB7231` | CTA primária, badges, hover |
| `brand-dark-orange` | Fundamento | `#D75227` | Hover forte, títulos de seção |
| `brand-dark` | Autoridade | `#3E3E3E` | Fundos escuros, texto principal |
| `brand-gray` | Urbano | `#979797` | Texto secundário, estados neutros |
| `brand-light` | Horizonte | `#E2E2E2` | Fundos suaves, divisórias |
| `brand-white` | Ascensão | `#FFFFFF` | Base clara, espaço visual |

> Nunca adicionar cores fora desta paleta sem justificativa. Usar tokens no Tailwind, nunca hex solto em componentes.

### Tipografia

| Função | Fonte | Uso |
|---|---|---|
| Display / Títulos | Bebas Neue (ALTA) | Headings, uppercase, seções |
| Corpo / Interface | Inter (ZALANDO) | Texto corrido, labels, inputs |

### Atributos de marca

Líder · Confiável · Moderna · Criativa

Em dúvida de tom de comunicação: priorizar **clareza e confiança** antes de efeito visual.

---

## 3. Regras de Preço

| Situação | Valor |
|---|---|
| 1º trailer (qualquer modelo) | $350.00 |
| 2º trailer (mesmo job site) | $175.00 (50% off) |
| 3º trailer em diante | $350.00 cada |
| Diária adicional (após 3 dias) | $100.00/dia |
| Tentativa de coleta frustrada | $150.00 |
| Taxa administrativa (material proibido) | $250.00 |

> Disposal/dump fees são cobrados separadamente pelo aterro — **não inclusos** no aluguel.

---

## 4. Catálogo de Trailers (MVP)

| ID | Modelo | Tamanho | GVWR | Payload |
|---|---|---|---|---|
| `compact-12x7` | Compact Dump Trailer | 12 × 7 ft | 9,990 lbs | 6,760 lbs |
| `standard-14x7` | Standard Dump Trailer | 14 × 7 ft | 14,000 lbs | 10,500 lbs |
| `pro-16x7` | Pro Dump Trailer | 16 × 7 ft | 14,000 lbs | 11,250 lbs |
| `heavy-duty-18x7` | Heavy Duty Dump Trailer | 18 × 7 ft | 17,600 lbs | 13,200 lbs |
| `commercial-20x8` | Commercial Dump Trailer | 20 × 8 ft | 25,000 lbs | 16,500 lbs |
| `custom-dump-trailer` | Custom (cliente informa specs) | — | — | — |

Flag para liberar outras categorias: `SHOW_ONLY_DUMP_TRAILERS` em `src/data/services.ts`.

---

## 5. Perfis de Usuário

| Role | Status possíveis | Aprovação manual? |
|---|---|---|
| `CUSTOMER` | PENDING → ACTIVE | Não — ativa automaticamente |
| `OWNER` | PENDING → ACTIVE / SUSPENDED | Sim — Admin aprova |
| `DRIVER` | PENDING → ACTIVE / SUSPENDED | Sim — Admin aprova |
| `ADMIN` | ACTIVE | Criado diretamente no banco |

---

## 6. Fluxo de Leads GHL

| `formType` | Quando dispara | Webhook env var |
|---|---|---|
| `booking` | Ao criar reserva | `NEXT_PUBLIC_GHL_BOOKING_WEBHOOK` |
| `owner_signup` | Ao cadastrar Owner | `NEXT_PUBLIC_GHL_OWNER_WEBHOOK` |
| `customer_signup` | Ao cadastrar Customer | `NEXT_PUBLIC_GHL_CUSTOMER_WEBHOOK` |
| `driver_signup` | Ao cadastrar Driver | `NEXT_PUBLIC_GHL_DRIVER_WEBHOOK` |
| `contact` | Ao enviar formulário de contato | `NEXT_PUBLIC_GHL_CONTACT_WEBHOOK` |

Sem variável configurada → modo demo (sem chamada de rede, UI continua funcionando).

---

## 7. Rotas da Plataforma

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | Landing page |
| `/services/:slug` | Público | Página de categoria de trailer |
| `/dump-trailer` | Público | Página rica do Dump Trailer |
| `/partner` | Público | Cadastro de Owner/Driver |
| `/faq` | Público | Perguntas frequentes |
| `/contact` | Público | Formulário de contato |
| `/auth/signup` | Público | Cadastro por perfil |
| `/auth/login` | Público | Login |
| `/dashboard/customer/*` | CUSTOMER ativo | Portal do cliente |
| `/dashboard/owner/*` | OWNER ativo | Dashboard do owner |
| `/dashboard/driver/*` | DRIVER ativo | App do driver (PWA) |
| `/admin/*` | ADMIN | Painel administrativo |

---

## 8. Stack de Referência Rápida

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 + TypeScript (App Router) |
| Banco | Supabase PostgreSQL |
| ORM | Prisma |
| Auth + Storage | Supabase Auth + Storage |
| Pagamentos | Stripe Checkout + Webhooks |
| CRM | GoHighLevel API + Webhooks |
| Mapas | Mapbox / Google Maps |
| Deploy | Vercel |
| Monitoramento | Sentry |
| Testes unitários | Vitest + Testing Library |
| Testes E2E | Playwright |

---

## 9. Informações Legais e Operacionais

- **Empresa:** Fagu Home Services
- **Localização:** Seattle, WA
- **Jurisdição:** Estado de Washin
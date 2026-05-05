# FAGU · Trailer Rental Platform

Landing/booking site da **FAGU Home Services & Logistics** — uma plataforma
multi-categoria de aluguel de trailers focada em conectar clientes a trailers
para qualquer trabalho (telhados, demolição, mudanças, transporte etc).

> **Status atual (MVP):** apenas **Dump Trailer** está liberado publicamente.
> A arquitetura já contempla 11 categorias e basta virar uma flag para
> liberar as demais quando o negócio estiver pronto.

---

## 1. Objetivos do produto

Definidos pelo cliente (Fabrício / FAGU):

1. **Manter a estrutura para todos os tipos de trailer** — enclosed, flatbed,
   utility, car hauler, cargo, box, motorcycle, horse, tow, boat. Não vamos
   refatorar quando crescer; só ligar.
2. **Liberar agora apenas Dump Trailer.** É o foco comercial da fase atual.
3. **Permitir customização de tamanho e capacidade.** O cliente pode escolher
   entre os modelos prontos ou pedir um trailer customizado informando
   modelo, dimensões, altura lateral e capacidade.
4. **Cobrir vários modelos dentro de Dump Trailer:** 5 modelos com tamanhos
   (12 a 20 ft), alturas laterais (2 ft / 4 ft) e capacidades distintas.
5. **Conversão antes de tudo:** booking online, day-before delivery, pickup
   incluso, pré-pagamento via Stripe e captura de leads via GoHighLevel.

---

## 2. O que está liberado hoje

| Área                          | Status                                  |
| ----------------------------- | --------------------------------------- |
| Dump Trailer (12-20 ft)       | ✅ Bookable online                      |
| Custom Dump Trailer           | ✅ Cliente pede tamanho/capacidade      |
| Outras 10 categorias          | ⏳ Estrutura pronta, escondidas via flag |
| Webhooks GHL (leads)          | ✅ Plug-and-play via `.env`             |
| Pagamento Stripe              | ⏳ Página simulada, pronta para integrar |

---

## 3. Modelos de Dump Trailer disponíveis

Definidos em [`src/data/trailers.js`](./src/data/trailers.js):

| Modelo                | Tamanho   | Altura | Capacidade (4 ft sides) | GVWR        |
| --------------------- | --------- | ------ | ----------------------- | ----------- |
| Compact               | 12 × 7 ft | 4 ft   | 12.1 yd³                | 9,990 lbs   |
| Standard              | 14 × 7 ft | 4 ft   | 14.4 yd³                | 14,000 lbs  |
| Pro                   | 16 × 7 ft | 4 ft   | 16.4 yd³                | 14,000 lbs  |
| Heavy Duty            | 18 × 7 ft | 4 ft   | 18.5 yd³                | 17,600 lbs  |
| Commercial            | 20 × 8 ft | 4 ft   | 20.7 yd³                | 25,000 lbs  |
| **Custom (qualquer)** | A pedido  | A pedido | A pedido              | A pedido    |

A opção "Custom" abre os campos extras no formulário de booking (modelo,
size, side height, capacidade) e é validada antes do submit.

---

## 4. Regras de preço

- **First trailer:** $350
- **Second trailer (mesmo job site):** 50% off → $175
- Reservas são confirmadas apenas após pré-pagamento.
- Disposal/dump fees **não** estão inclusos no preço de aluguel.

---

## 5. Stack

### Landing page (estado atual — Vite)
- **React 19** + **Vite** (SPA com React Router)
- **TailwindCSS 3** com tema FAGU (paleta + tipografia)
- Fonte: Bebas Neue (display) + Inter (body)
- Lead capture: **GoHighLevel** webhooks (um por formulário)
- Pagamentos: **Stripe Checkout** (demo mode — integração pendente)

### Plataforma completa (stack de destino — Next.js)
- **Next.js 15 + TypeScript** — base fullstack com App Router, SSR e Server Actions
- **Supabase PostgreSQL** — banco relacional com RLS por perfil
- **Prisma** — ORM com migrations tipadas
- **Supabase Auth + Storage** — autenticação e upload de documentos/evidências
- **Stripe Checkout + Webhooks** — cobrança antecipada e conciliação
- **GoHighLevel API + Webhooks** — CRM, pipeline e comunicação automatizada
- **Mapbox / Google Maps** — geocodificação e contexto de rota
- **Vercel + Sentry** — deploy contínuo e monitoramento de erros

> A migração da landing page Vite → Next.js está detalhada na Fase 2 do plano de implementação.

---

## 6. Scripts

```bash
npm install     # instala dependências
npm run dev     # dev server (http://localhost:5173)
npm run build   # build de produção em ./dist
npm run preview # preview do build local
```

---

## 7. Estrutura de pastas

```
src/
├── main.jsx                     # entry + react-router (rotas SPA)
├── App.jsx                      # (não usado — usamos pages/)
├── index.css                    # Tailwind layers + estilos globais
│
├── pages/                       # rotas top-level
│   ├── HomePage.jsx             # /
│   ├── ServicePage.jsx          # /services/:slug (genérico)
│   ├── DumpTrailerPage.jsx      # /services/dump-trailer (página rica)
│   ├── PartnerPage.jsx          # /partner, /partner/:role
│   ├── FAQPage.jsx              # /faq
│   └── ContactPage.jsx          # /contact
│
├── components/
│   ├── Header.jsx               # nav fixo + drawer mobile
│   ├── Hero.jsx                 # hero da home com carrossel de fotos
│   ├── ServicesCarousel.jsx     # vitrine de categorias (apenas DT no MVP)
│   ├── Trailers.jsx             # seletor de modelos + custom CTA
│   ├── TrailerCard.jsx          # card de modelo individual
│   ├── BookingForm.jsx          # form + validação + opção custom
│   ├── Benefits.jsx, HowItWorks.jsx, Rules.jsx, FAQ.jsx, FinalCTA.jsx
│   ├── Partner.jsx, PartnerTeaser.jsx
│   ├── Payment.jsx              # placeholder de Stripe
│   └── Footer.jsx, FaguBadge.jsx
│
├── data/
│   ├── services.js              # 11 categorias + flag SHOW_ONLY_DUMP_TRAILERS
│   └── trailers.js              # 5 modelos de dump trailer (specs completas)
│
├── services/
│   └── leads.js                 # submitLead() → GHL webhook por formType
│
├── config/
│   └── api.js                   # API_CONFIG: GHL, Stripe, Google Maps, contato
│
└── assets/                      # fotos (.webp/.jpg) + logos
```

---

## 8. Launch gate (liberar outros trailers)

A flag fica em [`src/data/services.js`](./src/data/services.js):

```js
export const SHOW_ONLY_DUMP_TRAILERS = true; // MVP: só dump trailer
// → mude para `false` para exibir as 11 categorias publicamente
```

Quando `true`:
- Home mostra apenas o card de Dump Trailer + aviso "Coming soon".
- `/services/:slug` só aceita slugs públicos (rota redireciona para `/`).
- `Hero` segue rotacionando todas as fotos para reforçar a visão multi-categoria.

Quando `false`:
- Carrossel completo, todas as rotas `/services/:slug` ativas, links de
  waitlist em vez de booking nas categorias ainda não bookáveis.

---

## 9. Fluxo de leads

Tudo passa por `submitLead(formType, data)` em
[`src/services/leads.js`](./src/services/leads.js):

| `formType`         | Origem                              | Webhook env var               |
| ------------------ | ----------------------------------- | ----------------------------- |
| `booking`          | Booking de Dump Trailer             | `VITE_GHL_BOOKING_WEBHOOK`    |
| `owner_signup`     | Cadastro de owners (Partner)        | `VITE_GHL_OWNER_WEBHOOK`      |
| `customer_signup`  | Waitlist de outros trailers/clientes | `VITE_GHL_CUSTOMER_WEBHOOK`   |
| `driver_signup`    | Cadastro de motoristas              | `VITE_GHL_DRIVER_WEBHOOK`     |
| `contact`          | Formulário de contato genérico      | `VITE_GHL_CONTACT_WEBHOOK`    |

Sem `.env` configurado, o site roda em **demo mode**: tudo flui na UI, mas
nada vai para o GHL. Útil para preview de design/QA.

`.env.example`:

```
VITE_GHL_BOOKING_WEBHOOK=
VITE_GHL_OWNER_WEBHOOK=
VITE_GHL_CUSTOMER_WEBHOOK=
VITE_GHL_DRIVER_WEBHOOK=
VITE_GHL_CONTACT_WEBHOOK=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_STRIPE_CHECKOUT_ENDPOINT=
VITE_GOOGLE_MAPS_KEY=
VITE_CONTACT_PHONE=
VITE_CONTACT_EMAIL=
VITE_CONTACT_HOURS=
```

---

## 10. Identidade visual (resumo)

- **Fluxo (laranja claro)** `#EB7231` — accent primário, badges, hover
- **Fundamento (laranja escuro)** `#D75227` — títulos de seção, hover forte
- **Autoridade (cinza escuro)** `#3E3E3E` — fundos hero, painel de specs
- **Bege/Off-white** — backgrounds suaves
- Detalhes hazard-stripe pretos/amarelos no hero para reforçar o universo
  de construção.

Tipografia: **Bebas Neue** (display, uppercase) + **Inter** (texto corrido).

---

## 11. Roadmap

O plano de implementação completo e detalhado está em [`planoimplementação.md`](./planoimplementação.md).

Esse arquivo é a fonte de verdade para todas as decisões de desenvolvimento — 13 fases desde a fundação técnica até o go-live. Sempre consulte e atualize ele à medida que o projeto avança.

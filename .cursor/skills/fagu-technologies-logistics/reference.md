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

Plataforma web para gestão de aluguel de dump trailers integrando:

- proprietários de frota;
- motoristas logísticos;
- empresas de roofing;
- administração da Fagu.

Meta principal:

- MVP funcional em 1 semana;
- frota inicial de 100 trailers;
- 5 depósitos;
- automação GoHighLevel;
- pagamento antecipado.

## 2) Personas e Fluxos Operacionais

- **Owner:** dono com 4+ trailers, foco em ocupação e automação.
- **Driver:** motorista com truck próprio, até 4 trailers/dia.
- **Roofing Company:** cliente que aluga para descarte de resíduos.
- **Admin (Fagu):** gestão de usuários, faturamento, auditoria e suporte.

## 3) Escopo Técnico por Módulo (Story Points)

### 3.1 Base e Gestão

1. Autenticação & Autorização (40 SP)  
   RBAC, JWT + refresh token, 2FA para owners.

2. Cadastro de Usuários & KYC (80 SP)  
   Onboarding, validação de CNH/seguro, Stripe Connect.

3. Catálogo de Trailers & Ativos (100 SP)  
   CRUD, VIN, placa, status ativo/manutenção, inspeções.

4. Gestão de Depósitos (50 SP)  
   Inventário em 5 locais, alertas de capacidade.

### 3.2 Operação e Logística

5. Reservas e Agendamento (120 SP)  
   Disponibilidade, prevenção de conflitos, recorrência.

6. Sistema de Pagamentos (90 SP)  
   Cobrança antecipada de aluguel + taxa, webhooks Stripe.

7. Logística & Drivers (150 SP)  
   GPS em tempo real, rotas via Google Maps, foto + assinatura.

8. Gestão de Landfill & Lixo (70 SP)  
   Cálculo por pesagem e cobrança dinâmica por tonelada.

### 3.3 Integrações e Dashboards

9. Integração GoHighLevel (80 SP)  
   Sincronização bidirecional e automações SMS/WhatsApp.

10. Dashboards & BI (70 SP)  
    Ganhos, ocupação, performance de motoristas.

11. Manutenção Preventiva (40 SP)  
    Alertas por tempo/uso (pneus, freios, elétrica).

12. Painel Administrativo (60 SP)  
    Gestão de transações, reembolsos e bloqueio de usuários.

## 4) Stack Tecnológica Proposta

- **Backend:** Node.js 18+ / TypeScript
- **Framework:** Express.js / Prisma ORM
- **Frontend:** React.js / Vite / Tailwind
- **Banco:** PostgreSQL 14+
- **Tempo real:** Socket.io / Redis
- **Infra:** AWS (EC2, RDS, S3)

## 5) Matriz de Esforço e Precificação (MVP 2 Semanas)

- Backend Developer (Senior): 2
- Frontend Developer (Senior): 1
- QA/Tester: 1
- DevOps/PM (part-time): 1
- Total: 5 pessoas
- Referência de custo: US$ 7/h

## 6) Roadmap

### Sprint 1 (Dias 1-7) — Fundação e Cadastro

- Setup AWS e CI/CD;
- módulos 1, 2, 3, 4;
- frontend de login/registro/gestão de frota.

Entrega: base funcional para cadastro validado.

### Sprint 2 (Dias 8-14) — Core Business e MVP

- módulos 5, 6, 7, 9;
- Stripe para pagamento antecipado;
- logística básica (sem otimização avançada).

Entrega: agendamento + pagamento + confirmação de entrega.

## 7) Riscos e Mitigações

- **Risco principal:** geolocalização em tempo real (Módulo 7).  
  Mitigação: biblioteca madura de tracking e foco em precisão antes de UI.

- **Risco Stripe:** falhas em webhooks.  
  Mitigação: fila de retry (BullMQ) + observabilidade.

- **Risco de escala:** concorrência em reservas simultâneas.  
  Mitigação: locks no banco e estratégia transacional no Prisma/PostgreSQL.

## 8) Requisitos Não-Funcionais

1. Performance: API < 200ms.
2. Segurança: criptografia de dados e conformidade PCI-DSS.
3. Disponibilidade: SLA 99,5% + backups diários no RDS.
4. Escalabilidade: até 1.000 trailers sem refatoração estrutural.

# Fagu Technologies & Logistics

## Documento Executivo Técnico

**Projeto:** Fagu Dump Trailer Rental System  
**Objetivo do documento:** detalhamento para precificação e cronograma  
**Data de referência:** 26 de abril de 2026

---

## 1. Resumo Executivo

O Fagu Dump Trailer Rental System é uma plataforma web para gestão de aluguel de dump trailers, conectando:

- proprietários de frota;
- motoristas logísticos;
- empresas de roofing;
- administração central da Fagu.

O objetivo principal é entregar um **MVP funcional em 1 semana**, iniciando operação com:

- **100 trailers**
- **5 depósitos**
- automação via **GoHighLevel**
- pagamentos antecipados

---

## 2. Personas e Fluxos Operacionais

O sistema deve suportar permissões granulares por perfil:

### Owner (Dono de Trailers)
- Perfil com 4+ trailers.
- Busca maximizar ocupação da frota.
- Precisa automatizar disponibilidade/folgas e retorno financeiro.

### Driver (Motorista)
- Profissional com truck próprio.
- Realiza entrega e retirada de trailers.
- Limite operacional: **até 4 trailers/dia**.

### Roofing Company (Cliente)
- Empresa que aluga trailer para descarte de resíduos de telhado/obra.
- Necessita reserva simples, previsível e com confirmação rápida.

### Admin (Fagu)
- Gestão centralizada de usuários, faturamento, auditoria e suporte.

---

## 3. Escopo Técnico Detalhado — Módulos

Estimativas em Story Points (SP), considerando integração externa e requisitos de tempo real.

### 3.1 Módulos de Base e Gestão

1. **Autenticação & Autorização (40 SP)**  
   RBAC para 3 tipos de usuários, JWT + Refresh Token e 2FA para Owners.

2. **Cadastro de Usuários & KYC (80 SP)**  
   Onboarding completo, validação documental (CNH/Seguro) e Stripe Connect.

3. **Catálogo de Trailers & Ativos (100 SP)**  
   CRUD com VIN, placa, status (ativo/manutenção) e histórico de inspeção.

4. **Gestão de Depósitos (50 SP)**  
   Inventário físico por 5 localizações com alertas de capacidade.

### 3.2 Módulos de Operação e Logística

5. **Reservas e Agendamento (120 SP)**  
   Busca de disponibilidade, prevenção de conflito e recorrência (semanal/mensal).

6. **Sistema de Pagamentos (90 SP)**  
   Cobrança antecipada de aluguel + taxa via Stripe e tratamento de webhooks.

7. **Logística & Drivers (150 SP)**  
   Tracking GPS em tempo real, rotas via Google Maps API e prova de entrega (foto + assinatura).

8. **Gestão de Landfill & Lixo (70 SP)**  
   Cálculo por pesagem (entrada/saída) e faturamento dinâmico por tonelada.

### 3.3 Integrações e Dashboards

9. **Integração GoHighLevel (80 SP)**  
   Sincronização bidirecional de contatos, calendário e automações SMS/WhatsApp.

10. **Dashboards & BI (70 SP)**  
    Indicadores de receita, ocupação e performance operacional.

11. **Manutenção Preventiva (40 SP)**  
    Alertas por tempo/uso para pneus, freios e elétrica.

12. **Painel Administrativo (60 SP)**  
    Gestão global de transações, reembolsos, bloqueios e auditoria.

---

## 4. Stack Tecnológica Proposta

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Backend | Node.js 18+ / TypeScript | Alta performance para I/O e escalabilidade horizontal |
| Framework | Express.js / Prisma ORM | Desenvolvimento ágil com segurança de tipos |
| Frontend | React.js / Vite / Tailwind | UI responsiva e carregamento rápido |
| Banco de Dados | PostgreSQL 14+ | Integridade referencial para transações |
| Real-time | Socket.io / Redis | Tracking de ativos e motoristas em tempo real |
| Infraestrutura | AWS (EC2, RDS, S3) | Confiabilidade e escala para 100+ ativos |

---

## 5. Matriz de Esforço e Precificação (MVP 2 Semanas)

Premissa de operação em alta disponibilidade para acelerar entrega.

| Recurso | Quantidade | Horas Totais | Custo Est. (US$ 7/h) |
|---|---:|---:|---:|
| Backend Developer (Senior) | 2 | A definir | A definir |
| Frontend Developer (Senior) | 1 | A definir | A definir |
| QA / Tester | 1 | A definir | A definir |
| DevOps / PM (Part-time) | 1 | A definir | A definir |
| **TOTAL** | **5** | **A definir** | **A definir** |

> Observação: preencher horas por sprint e custo final após detalhamento de capacidade diária do time.

---

## 6. Roadmap de Desenvolvimento

### 6.1 Sprint 1 — Fundação e Cadastro (Dias 1-7)

- Setup de infraestrutura AWS e CI/CD.
- Implementação dos módulos 1, 2, 3 e 4.
- Frontend dos fluxos de login, registro e gestão de frota.
- **Entrega esperada:** plataforma apta para cadastro validado de usuários e trailers.

### 6.2 Sprint 2 — Core Business e MVP (Dias 8-14)

- Implementação dos módulos 5, 6, 7 e 9 (foco reservas + GoHighLevel).
- Integração Stripe para pagamentos antecipados.
- Logística básica (sem otimização avançada de rota).
- **Entrega esperada:** sistema funcional para agendamento, pagamento e confirmação de entrega.

---

## 7. Riscos Técnicos e Mitigações

### Risco principal: geolocalização em tempo real (Módulo 7)
- **Impacto:** alto no prazo de 1 semana.
- **Mitigação:** priorizar bibliotecas maduras de tracking e precisão de dados antes de refinamento visual.

### Risco de pagamento: falhas em webhooks Stripe
- **Mitigação:** filas de retry com BullMQ e monitoramento de eventos críticos.

### Risco de escala: concorrência em reservas simultâneas
- **Mitigação:** locks transacionais em banco (com Prisma + PostgreSQL) e validação otimista/pessimista conforme cenário.

---

## 8. Requisitos Não-Funcionais

13. **Performance:** tempo de resposta de API inferior a 200ms (p95, meta inicial).  
14. **Segurança:** criptografia de dados sensíveis e conformidade PCI-DSS para pagamentos.  
15. **Disponibilidade:** SLA de 99,5% com backups diários automatizados no AWS RDS.  
16. **Escalabilidade:** arquitetura preparada para suportar até 1.000 trailers sem refatoração estrutural.

---

## 9. Diretriz de MVP

Para o primeiro release, priorizar:

- reserva e disponibilidade confiáveis;
- pagamento antecipado estável;
- integrações essenciais (GHL + Stripe);
- rastreabilidade operacional mínima viável (status, entrega e retirada).

Tudo que for estético ou avançado deve ficar atrás da meta de operação real com baixa fricção.

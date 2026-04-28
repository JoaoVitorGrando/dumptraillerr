---
name: fagu-technologies-logistics
description: Usa o contexto executivo, técnico e de identidade visual da Fagu para orientar decisões de arquitetura, priorização de MVP, escopo de módulos, integrações e design system. Use quando o usuário pedir planejamento, implementação, estimativas, cronograma, precificação, documentação técnica, roadmap, brand book, paleta de cores, tipografia ou decisões de produto/engenharia da Fagu.
---

# Fagu Technologies & Logistics

## Objetivo

Aplicar padrões e diretrizes do projeto Fagu para garantir que respostas técnicas e implementações fiquem alinhadas com:

- MVP operacional rápido;
- fluxo de reservas e pagamento antecipado;
- integração com GoHighLevel;
- escalabilidade para crescimento de frota.

## Quando usar esta skill

Use esta skill quando o pedido envolver:

- arquitetura backend/frontend do sistema Fagu;
- modelagem de módulos (auth, catálogo, reservas, logística, pagamentos);
- integrações Stripe, GoHighLevel, Google Maps, AWS;
- cronograma, esforço em SP, precificação e planejamento por sprint;
- requisitos não-funcionais (SLA, performance, segurança, escala);
- análise de risco técnico e mitigação.
- identidade visual, brand book, paleta e tipografia.

## Fluxo recomendado

1. Ler o contexto completo em [reference.md](reference.md).
2. Classificar a solicitação em: `MVP`, `Escala`, `Operação`, `Integração`, `Risco`.
3. Priorizar o que impacta operação real:
   - reservas confiáveis;
   - pagamento estável;
   - confirmação de entrega;
   - automação de comunicação.
4. Se houver prazo curto, reduzir escopo para núcleo de negócio e adiar otimizações visuais.
5. Sempre explicitar trade-offs de prazo x complexidade.

## Regras de priorização

- Prioridade 1: Reservas + disponibilidade + prevenção de conflito.
- Prioridade 2: Pagamento antecipado e confiabilidade de webhook.
- Prioridade 3: Fluxo logístico mínimo funcional (entrega/retirada + status).
- Prioridade 4: Dashboards avançados, BI e otimizações não bloqueantes.

## Regras de identidade visual

- Aplicar os atributos de marca: `líder`, `confiável`, `moderna`, `criativa`.
- Manter consistência de nomenclatura e semântica das cores do Brand Book.
- Em decisões de UI, priorizar clareza, confiança e legibilidade sobre efeitos visuais.
- Sempre usar tokens de design em vez de cores soltas hardcoded em componentes.
- Em dúvida entre estética e operação, manter o padrão visual oficial e reduzir complexidade.

## Guardrails técnicos

- Em concorrência de reservas, sugerir locks transacionais no banco.
- Em Stripe, tratar idempotência e fila de retry para webhooks.
- Em tracking em tempo real, preferir precisão e estabilidade antes de estética.
- Em decisões de infraestrutura, manter compatibilidade com meta de 1.000 trailers.

## Formato de resposta recomendado

Ao responder solicitações de planejamento/arquitetura:

1. Contexto do problema.
2. Decisão técnica recomendada.
3. Impacto em prazo e risco.
4. Próximos passos executáveis (curto prazo).

## Fonte de verdade

- Documento executivo completo: [reference.md](reference.md)

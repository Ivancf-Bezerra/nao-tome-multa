# Fluxo de Desenvolvimento — Não Tome Multa

## Visão Geral das Fases

| Fase | Nome | Critério de Conclusão |
|---|---|---|
| 1 | Limpeza e Fundação | Sem APIs externas temporárias, sem mocks inline, docs criados |
| 2 | Motor de Análise | Catálogo + templates + analyzer + builder funcionais |
| 3 | Formulário Estruturado | InfractionForm com todos os campos do AIT |
| 4 | Sistema de Assinatura | Context + gate + telas de planos |
| 5 | Persistência Real | Defesas salvas em AsyncStorage, tab Defesas ativa |
| 6 | Contrato de Backend | Stubs e documentação de endpoints completos |

---

## Fase 1 — Limpeza e Fundação

**Status**: Concluída

### Tarefas
- [x] Remover `src/services/api.ts` (Zapay)
- [x] Remover integração FIPE do VehicleFipeSelector — apenas inputs manuais
- [x] Remover `ZAPAY_API_KEY` do `app.json`
- [x] Migrar `mockDefenses.ts` → `src/data/defesas/sampleDefesas.ts`
- [x] Migrar `MOCK_DRIVER` / `MOCK_VEHICLE` → `src/data/profile/sampleProfiles.ts`
- [x] Zerar valores padrão dos formulários (strings vazias)
- [x] Remover `console.log` de produção
- [x] Criar `.cursor/docs/` com 5 arquivos de documentação

### Pode ser paralelizado
- Remoção de APIs e limpeza de mocks são independentes.

---

## Fase 2 — Motor de Análise

**Status**: Concluída

### Tarefas
- [x] `src/data/inconsistencies/types.ts` — tipos de regras e inconsistências
- [x] `src/data/inconsistencies/catalog.ts` — 9+ regras CTB/CONTRAN
- [x] `src/data/defenseTemplates/types.ts` — tipos de templates
- [x] `src/data/defenseTemplates/templates.ts` — textos pré-redigidos
- [x] Refatorar `TechnicalAnalyzer.ts` — regras reais
- [x] Refatorar `AnalysisResult.ts` — retorno completo com findings
- [x] Criar `DefenseBuilder.ts` — composição por template

### Dependências
- O `TechnicalAnalyzer` depende do catálogo de inconsistências.
- O `DefenseBuilder` depende dos templates e do resultado da análise.

---

## Fase 3 — Formulário de Infração Estruturado

**Status**: Concluída

### Tarefas
- [x] Refatorar `src/services/infractions/types.ts` — `InfractionInput` estruturado
- [x] Refatorar `src/app/analysis/InfractionForm.tsx` — campos por seção
- [x] Atualizar `useInfractionSearch.ts` para usar `InfractionInput`

### Dependências
- Depende dos tipos definidos na Fase 2.

---

## Fase 4 — Sistema de Assinatura

**Status**: Concluída

### Tarefas
- [x] `src/context/SubscriptionContext.tsx` — estado e hook `useSubscription`
- [x] `src/services/subscription/subscriptionService.ts` — stub do backend
- [x] `src/app/subscription/plans.tsx` — tela de planos
- [x] `src/app/subscription/checkout.tsx` — stub de pagamento
- [x] `src/components/subscription/SubscriptionBanner.tsx` — banner de upgrade
- [x] Gate na `home.tsx` — exibir análise apenas com plano ativo
- [x] `SubscriptionContext` adicionado ao `_layout.tsx`

### Dependências
- Gate depende do `SubscriptionContext` estar disponível na árvore.

---

## Fase 5 — Persistência Real das Defesas

**Status**: Concluída

### Tarefas
- [x] Implementar `src/components/defesas/storage.ts` — CRUD com AsyncStorage
- [x] Refatorar `defesas.tsx` — carregar/salvar/deletar via storage, sem mocks
- [x] Integrar geração de defesa (`DefenseBuilder`) na tela de defesas
- [x] Habilitar tab Defesas no `_layout.tsx` de tabs

### Dependências
- Depende do `DefenseBuilder` (Fase 2) e do `SubscriptionContext` (Fase 4).

---

## Fase 6 — Contrato de Backend

**Status**: Concluída

### Tarefas
- [x] `src/services/backend/apiClient.ts` — cliente HTTP centralizado
- [x] `src/services/backend/subscriptionApi.ts` — endpoints de assinatura
- [x] `src/services/backend/defesasApi.ts` — endpoints de defesas
- [x] `.cursor/docs/endpoints.md` — documentação completa

### Pode ser paralelizado
- Os stubs de subscription e defesas são independentes entre si.

---

## Próximas Fases (Roadmap Futuro)

| Fase | Nome | Descrição |
|---|---|---|
| 7 | Integração Backend Real | Substituir stubs por chamadas HTTP reais |
| 8 | Gateway de Pagamento | Integrar Stripe ou similar no checkout |
| 9 | Onboarding | Refinar fluxo de onboarding inicial |
| 10 | Notificações | Push notifications para status de defesas |
| 11 | Sincronização | Sync de perfil técnico e defesas com backend |
| 12 | Analytics | Integração de métricas de uso |

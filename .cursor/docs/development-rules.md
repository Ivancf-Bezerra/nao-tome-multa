# Regras de Desenvolvimento — Não Tome Multa

## 1. Nomenclatura

- **Componentes React**: PascalCase — `TechnicalProfileCard.tsx`
- **Hooks customizados**: camelCase com prefixo `use` — `useInfractionSearch.ts`
- **Services / utils**: camelCase — `defenseBuilder.ts`, `subscriptionService.ts`
- **Tipos e interfaces**: PascalCase — `InfractionInput`, `AnalyzedInfractionRecord`
- **Constantes globais**: UPPER_SNAKE_CASE — `EMPTY_DRIVER`, `INCONSISTENCY_CATALOG`
- **Arquivos de dados/exemplos**: prefixo `sample` em `src/data/` — `sampleDefesas.ts`

## 2. TypeScript

- Proibido usar `any` explícito. Use tipos estritos ou `unknown` com narrowing.
- Todas as interfaces de domínio devem estar em arquivos `types.ts` dentro da pasta correspondente.
- Prefer `interface` para contratos de dados, `type` para unions/aliases.
- Exports nomeados em vez de default para types e interfaces.

## 3. Imports

- Usar alias `@/` mapeado para `src/` — configurar em `tsconfig.json`.
- Ordem de imports: React/RN nativos → libs externas → contextos → services → componentes → assets.
- Sem imports circulares entre camadas.

## 4. Componentes

- Componentes de UI são **puros**: recebem props, não acessam Context ou services diretamente.
- Lógica de negócio pertence a hooks ou services, não a componentes.
- Componentes dentro de `src/components/ui/` são genéricos e reutilizáveis sem acoplamento de domínio.
- Componentes dentro de `src/components/<domínio>/` são específicos do domínio.

## 5. Services

- Services em `src/services/` são funções TypeScript puras — **sem hooks React**.
- Toda comunicação com backend passa por `src/services/backend/`.
- Services não importam componentes ou contextos.

## 6. Context

- Context API é reservado para estado verdadeiramente global: autenticação, perfil técnico, assinatura.
- Estado local de tela fica em `useState` dentro do componente de tela.
- Cada context exporta um hook customizado (`useTechnicalProfile`, `useSubscription`).

## 7. Armazenamento

- **SecureStore**: dados sensíveis (tokens Clerk, perfil técnico com CPF/RENAVAM).
- **AsyncStorage**: dados não sensíveis (lista de defesas, preferências).
- Chaves de storage definidas centralmente em `src/storage/storageKeys.ts`.
- Nenhum dado sensível é armazenado em AsyncStorage.

## 8. Dados de Exemplo

- Dados mockados/de exemplo ficam **exclusivamente** em `src/data/<domínio>/`.
- São importados apenas em ambientes de desenvolvimento — nunca em fluxos de produção.
- Nomenclatura: `sampleXxx.ts` (ex: `sampleProfiles.ts`, `sampleDefesas.ts`).

## 9. Logging

- `console.log` é proibido em código de produção.
- Erros críticos usam `console.error` apenas em blocos `catch` de operações assíncronas críticas.
- Todo log de depuração é removido antes de merge na branch principal.

## 10. Análise de Inconsistências

- O catálogo de inconsistências é a **fonte única de verdade** para regras de análise.
- Localização: `src/data/inconsistencies/catalog.ts`.
- Nenhuma regra de análise é hardcoded fora do catálogo.
- Templates de defesa em `src/data/defenseTemplates/templates.ts` são mapeados 1:1 por `code`.

## 11. Sistema de Assinatura

- A geração de defesas é **sempre** bloqueada pelo `SubscriptionContext`.
- Qualquer tela que acesse geração de defesa deve verificar `useSubscription().isActive`.
- O gateway de pagamento é implementado exclusivamente em `src/app/subscription/checkout.tsx`.

## 12. Backend

- O backend é desenvolvido em repositório separado.
- O mobile mantém apenas contratos (stubs) em `src/services/backend/`.
- Toda integração com API usa o `apiClient.ts` centralizado.
- Novos endpoints são documentados em `.cursor/docs/endpoints.md` com referência ao arquivo de serviço.

## 13. Estrutura de Pastas (regra de ouro)

```
src/
  app/          → rotas (Expo Router) — apenas lógica de tela
  components/   → UI por domínio — sem lógica de negócio
  context/      → estado global (Context API)
  data/         → dados de exemplo e catálogos estáticos
  services/     → lógica de negócio e integrações
  storage/      → chaves e utilitários de armazenamento
```

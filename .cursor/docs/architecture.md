# Arquitetura — Não Tome Multa

## Visão Geral

O projeto é um aplicativo mobile React Native/Expo com backend externo separado. O mobile é responsável pela experiência do usuário, análise local de inconsistências e composição de defesas por templates. O backend gerencia autenticação, assinaturas e persistência centralizada.

## Camadas do Mobile

```
┌─────────────────────────────────────────────┐
│              src/app/ (Rotas)               │
│  Expo Router file-based routing             │
│  Telas, navegação, modais                   │
├─────────────────────────────────────────────┤
│           src/components/ (UI)              │
│  Componentes puros por domínio              │
│  Sem lógica de negócio                      │
├─────────────────────────────────────────────┤
│            src/context/ (Estado)            │
│  TechnicalProfileContext                    │
│  SubscriptionContext                        │
├─────────────────────────────────────────────┤
│           src/services/ (Negócio)           │
│  analysis/ → motor de análise               │
│  infractions/ → gestão de infrações         │
│  subscription/ → gestão de planos           │
│  backend/ → contratos de API (stubs)        │
├─────────────────────────────────────────────┤
│             src/data/ (Estático)            │
│  inconsistencies/ → catálogo de regras      │
│  defenseTemplates/ → textos pré-redigidos   │
│  profile/ → dados de exemplo               │
│  defesas/ → defesas de exemplo             │
├─────────────────────────────────────────────┤
│           src/storage/ (Persistência)       │
│  SecureStore → dados sensíveis              │
│  AsyncStorage → dados não sensíveis         │
└─────────────────────────────────────────────┘
```

## Fluxo de Análise de Multa

```
InfractionForm (entrada do usuário)
        ↓
InfractionInput (modelo estruturado)
        ↓
TechnicalAnalyzer.analyze(input)
  → verifica cada campo contra o catalog
  → retorna InconsistencyRule[] encontradas
        ↓
AnalysisResult { hasInconsistencies, findings, summary }
        ↓
  [hasInconsistencies = false] → "Sem base para defesa"
  [hasInconsistencies = true]  → DefenseBuilder.build(findings, profile)
                                      ↓
                                 DefenseTemplate por code
                                      ↓
                                 Texto de defesa composto
                                      ↓
                                 AnalyzedInfractionRecord salvo
```

## Fluxo de Assinatura

```
SubscriptionContext (carregado no boot)
  → GET /user/subscription (backend)
  → isActive: boolean
        ↓
  [isActive = false] → SubscriptionBanner → plans.tsx → checkout.tsx
  [isActive = true]  → FineAnalysisCard habilitado
```

## Separação Mobile / Backend

| Responsabilidade | Mobile | Backend |
|---|---|---|
| Autenticação | Clerk SDK (cliente) | Clerk (servidor) |
| Análise de inconsistências | Motor local (TechnicalAnalyzer) | Futuro: catálogo server-side |
| Composição de defesa | DefenseBuilder (templates locais) | Futuro: geração server-side |
| Persistência de defesas | AsyncStorage (local) | API /defesas (sincronização) |
| Perfil técnico | SecureStore (local) | Futuro: sincronização |
| Assinatura | SubscriptionContext (leitura) | API /subscription (escrita) |
| Pagamento | checkout.tsx (UI stub) | Gateway (Stripe/etc) |

## Decisões Arquiteturais

### Análise local
A análise de inconsistências roda localmente no dispositivo para reduzir latência e dependência de conectividade. O catálogo é estático e versionado no app.

### Templates sem IA
A geração de defesas usa textos pré-redigidos por juristas mapeados a códigos de inconsistência. Isso elimina custo e latência de IA, e garante precisão jurídica.

### SecureStore para dados sensíveis
CPF, RENAVAM e número de CNH são armazenados em SecureStore (keychain iOS / keystore Android) por serem dados pessoais sensíveis.

### Stub de backend
O mobile não implementa a lógica de backend. Os services em `src/services/backend/` são stubs que simulam respostas até a integração real ser feita.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Expo SDK ~54 + React Native 0.81 |
| Linguagem | TypeScript ~5.9 (strict) |
| Roteamento | Expo Router v6 (file-based) |
| Autenticação | Clerk (`@clerk/clerk-expo`) |
| Estilização | NativeWind v4 (Tailwind CSS) |
| Armazenamento seguro | expo-secure-store |
| Armazenamento geral | @react-native-async-storage |
| Estado global | Context API + hooks customizados |

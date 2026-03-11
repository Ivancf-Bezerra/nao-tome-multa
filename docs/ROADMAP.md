## Roadmap Não Tome Multa — MVP

Este documento organiza as próximas etapas de evolução do aplicativo, com foco em um MVP juridicamente coerente e tecnicamente simples.

### 1. Fechar escopo do MVP (jurídico + fluxo)

- **Premissa de propriedade**: o veículo precisa estar registrado em nome do mesmo CPF do condutor (proprietário da CNH).
- **Âmbito de atuação**:
  - Defesa administrativa (Defesa Prévia).
  - Recurso à JARI.
  - Não inclui CETRAN, recursos judiciais ou outras instâncias.
- **Tipo de problema atendido**:
  - Inconsistências formais no Auto de Infração (AIT), como:
    - Falta de identificação do agente.
    - Falta ou erro de AIT/RENAINF.
    - Equipamento sem aferição válida.
    - Datas inconsistentes, campos obrigatórios ausentes, etc.
  - Não cobre “tese genérica” de mérito (ex.: “eu não passei no sinal” sem base formal).
- **Impactos esperados no produto**:
  - Templates de Defesa Prévia e Recurso à JARI assumem sempre:
    - Que o condutor é também o proprietário do veículo.
    - Que os dados do cadastro técnico refletem essa identidade.
  - Casos de veículo em nome de terceiro serão explicitamente não suportados nesta versão.

### 2. UX do fluxo principal (Home → Análise → Defesas → Status)

- Reforçar, na Home:
  - Sem **cadastro técnico** → CTA forte para preencher.
  - Sem **assinatura ativa** → destaque do benefício da análise técnica e geração de defesa/recurso.
- Validar melhor o formulário da multa (AIT, RENAINF, datas, órgão).
- Deixar claro, em texto de interface:
  - O que acontece depois de gerar e compartilhar a defesa.
  - Que o acompanhamento de prazos exatos depende do órgão autuador.

### 3. Cadastro técnico + aba Documentos

- Melhorar validações:
  - CPF com dígitos verificadores.
  - RENAVAM com regras básicas.
- Integrar melhor a aba **Documentos** ao fluxo:
  - Comunicar que é um atalho de preenchimento automático (futura OCR).
  - Sugerir o uso logo após login, caso não exista cadastro técnico.

### 4. Blindagem de assinatura (paywall)

- Regra: sem plano ativo, o app não executa:
  - Análise técnica completa.
  - Geração de Defesa Prévia.
  - Geração de Recurso à JARI.
- UX:
  - Ao tentar usar recurso pago sem assinatura, mostrar modal com:
    - Benefícios da análise.
    - Botão “Ver planos”.

### 5. Limpeza técnica e avisos

- Remover/ajustar:
  - Warnings de `SafeAreaView` deprecado.
  - Rota indevida de `masks.tsx` sendo tratada como tela pelo expo-router.
- Garantir mensagens de erro amigáveis para:
  - Falha de análise.
  - Falha na geração de defesa.
  - Falha de compartilhamento.

### 6. Preparar terreno para cenário de terceiros e OCR da multa (futuro)

- Planejar (sem implementar ainda):
  - Campos e fluxos específicos para:
    - Indicação de condutor.
    - Veículo já vendido antes da infração.
  - Interface para serviço de OCR/scan:
    - CNH.
    - Documento do veículo.
    - Multa (AIT/RENAINF).


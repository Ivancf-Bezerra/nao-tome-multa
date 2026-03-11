## Escopo do MVP — Não Tome Multa

Este documento descreve o recorte funcional e jurídico da primeira versão (MVP) do aplicativo.

### 1. Premissas centrais

- **Identidade condutor / proprietário**  
  - O veículo deve estar registrado em nome do **mesmo CPF** do condutor cadastrado no app.  
  - O cadastro técnico (condutor + veículo) assume que:
    - `driver.cpf === vehicle.ownerCpf`.
    - Os textos de defesa e recurso são sempre gerados em nome dessa mesma pessoa.

- **Âmbito de atuação**  
  - Defesa administrativa (Defesa Prévia) perante o órgão autuador/competente.
  - Recurso à JARI, quando a defesa for indeferida.
  - Não contempla:
    - Recursos ao CETRAN ou instâncias superiores.
    - Processos judiciais.
    - Consultas em outros bancos de dados além dos previstos em integrações futuras.

### 2. Tipos de casos atendidos

- Multas que permitem **verificação técnica do Auto de Infração (AIT)**, com foco em:
  - Campos obrigatórios ausentes ou inconsistentes (ex.: agente, AIT, RENAINF).
  - Equipamento de fiscalização sem aferição válida ou não identificado.
  - Datas incompatíveis (ex.: aferição vencida na data da infração).
  - Descumprimento de requisitos formais previstos no CTB e em resoluções do CONTRAN.

- Casos **explicitamente fora do escopo** nesta versão:
  - Veículo registrado em nome de **terceiro** (pessoa diferente do condutor cadastrado).
  - Situações de **venda anterior à infração** ou indicação de condutor real.
  - Tese puramente fática sem suporte técnico-formal (ex.: “eu não passei no sinal”, “não estava naquela via”) sem elementos documentais tratados pelo app.

### 3. Papel do aplicativo

- **O app faz**:
  - Recebe dados do AIT e do cadastro técnico.
  - Aplica regras de análise com base em inconsistências formais.
  - Gera textos padronizados de Defesa Prévia e Recurso à JARI, personalizados com os dados do usuário.
  - Organiza o fluxo de:
    - Analisar multa.
    - Gerar defesa.
    - Compartilhar defesa.
    - Acompanhar status e gerar eventual recurso à JARI.

- **O app não faz**:
  - Não protocola defesa ou recurso diretamente em sistemas de órgãos de trânsito.
  - Não garante deferimento ou resultado favorável.
  - Não substitui consulta com advogado ou profissional especializado.

### 4. Comunicação recomendada ao usuário

- Deixar claro em textos de interface e materiais de apoio que:
  - A versão atual do app atende **casos em que o veículo está no nome do próprio condutor**.
  - Para veículos em nome de terceiros ou situações de venda anterior, o usuário deverá aguardar versões futuras ou buscar orientação jurídica específica.
  - Os textos gerados têm caráter **técnico-informacional**, não sendo orientação jurídica individualizada.


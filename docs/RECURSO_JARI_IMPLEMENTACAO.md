## Guia de implementação – Recurso à JARI

Este documento descreve o passo a passo para implementar o novo fluxo de recurso à JARI, em que:
- O app **gera o texto** do recurso à JARI (já existente).
- O app **exporta** esse conteúdo em formato compartilhável (texto, e-mail e opcionalmente PDF).
- O app **orienta o usuário** com um passo a passo dentro do app.
- O app **entrega o link** do sistema externo do órgão competente e **explica o que fazer lá**, mas **não abre automaticamente** esse sistema.

---

## 1. Serviço de links para sistemas da JARI

**Objetivo:** centralizar a lógica que descobre o link correto do sistema de recursos/JARI para cada órgão autuador, **somente para exibição e orientação**, sem abrir automaticamente o sistema.

- **Arquivo novo:** `src/data/jari/orgaoLinks.ts`
  - Estrutura sugerida:
    - Mapa simples `Record<string, { label: string; url: string }>` usando código do órgão (ou sigla) como chave.
    - Exemplos iniciais:
      - `DETRAN-SP`
      - `DETRAN-RJ`
      - `PRF`
      - `CET-SP`
    - Deixar comentários de TODO para expandir a lista depois.

- **Arquivo novo:** `src/services/jari/JARILinkBuilder.ts`
  - Exportar um tipo:
    - `export interface JARILink { label: string; url: string; isFallback: boolean }`
  - Função principal:
    - `export function buildJARILink(issuingBodyCode?: string, issuingBodyName?: string, uf?: string): JARILink`
  - Comportamento:
    - 1) tenta encontrar link direto via `issuingBodyCode` → `orgaoLinks`.
    - 2) se não achar, tenta por `uf` (ex.: usar DETRAN da UF).
    - 3) se ainda não achar, cria um link de fallback:
      - `label`: `"Buscar sistema do órgão"`
      - `url`: `https://www.google.com/search?q=${encodeURIComponent(issuingBodyName + ' recurso JARI')}`
      - `isFallback: true`
  - Uso:
    - O link será **mostrado ou copiado para o usuário**, que decide como abrir o sistema no navegador ou app oficial.

- **Integração:** este serviço será usado pelo modal de recurso (`RecursoJARIModal`) para construir o link de “Acessar sistema”.

---

## 2. Exportação do recurso (texto e e-mail, opcional PDF)

**Objetivo:** dar ao usuário formatos prontos para colar/anexar no sistema externo.

### 2.1 Compartilhar como texto (já existente – apenas padronizar)

- **Onde:** lógica atual de `onSaveAndSendRecurso` em `RecursoJARIModal` (se existir) ou em um handler similar na tela Status.
- **Ações:**
  - Padronizar o conteúdo compartilhado:
    - Cabeçalho claro (`RECURSO À JARI — NÃO TOME MULTA`).
    - Bloco com AIT, órgão, resumo.
    - Texto completo do recurso (`item.recursoJARI`).
  - Garantir que o texto do recurso (JARI) seja exatamente o mesmo mostrado na UI.

### 2.2 Rascunho de e-mail

- **Onde:** novo botão dentro do fluxo de exportação (ver seção 3).
- **Implementação:**
  - Usar `Linking.openURL` com `mailto:`:
    - `mailto:?subject=Recurso%20à%20JARI%20-%20AIT%20${aitNumber}&body=${encodeURIComponent(conteudoRecurso)}`
  - Deixar o **destinatário em branco**, pois varia muito por órgão.
  - Importante: o corpo do e-mail deve conter:
    - Introdução curta.
    - Texto do recurso.
    - Aviso padrão de responsabilidade já usado em `DefenseBuilder`.

### 2.3 Geração de PDF (opcional, fase posterior)

- **Dependências:**
  - `npx expo install expo-print expo-sharing`
- **Arquivo novo sugerido:** `src/services/jari/JARIPdfExporter.ts`
  - Função `export async function exportJariToPdf(args: { item: StatusMultaEnviada; recursoJARI: string; })`
  - Montar um HTML simples com:
    - Cabeçalho com logo/título do app (pode ser só texto).
    - Bloco com dados da multa.
    - Corpo com texto do recurso (respeitando quebras de linha).
  - Usar `Print.printToFileAsync` para gerar o PDF.
  - Usar `Sharing.shareAsync` para abrir o compartilhamento do arquivo.

---

## 3. Novo fluxo de UI de exportação e passo a passo

### 3.1 Nova folha de ações: `JARIExportSheet`

**Arquivo novo:** `src/components/status/JARIExportSheet.tsx`

- Tipo de componente:
  - Bottom sheet simples (como outras folhas do projeto) com:
    - Título: “Como você quer usar o recurso à JARI?”
    - Subtítulo: “Escolha o formato para enviar no sistema do órgão.”
  - Opções de ação:
    - Botão 1: **“Copiar texto do recurso”**
      - Copia apenas `item.recursoJARI` ou o corpo completo (cabeçalho + texto).
      - Mostra feedback leve (“Copiado para a área de transferência.”).
    - Botão 2: **“Abrir e-mail com recurso preenchido”**
      - Chama a função de rascunho de e-mail (seção 2.2).
    - Botão 3 (opcional / fase posterior): **“Gerar PDF para envio”**
      - Chama `JARIPdfExporter`.

### 3.2 Novo modal de passo a passo: `JARIGuideModal`

**Arquivo novo:** `src/components/status/JARIGuideModal.tsx`

- Estrutura:
  - Modal em tela cheia ou bottom sheet alto (85–90%).
  - Cabeçalho:
    - Título: “Como enviar o recurso à JARI”
    - Subtítulo: “Siga estes passos no sistema do órgão.”
  - Lista de passos numerados (por exemplo 1 a 7):
    1. **Preparar o recurso**
       - “Copie o texto gerado ou baixe o PDF.”
       - Botão secundário chamando `JARIExportSheet`.
    2. **Acessar o sistema**
       - Mostrar `link.label` e **exibir a URL** (ou permitir copiar o link).
       - Explicar: “Use esse endereço no navegador ou aplicativo oficial do órgão para iniciar o recurso à JARI.”
       - Aviso se `isFallback === true` (“Confirme sempre se o site é o oficial do órgão responsável pela autuação.”).
    3. **Fazer login**
       - Texto curto genérico (CPF/senha gov.br ou credenciais do órgão).
    4. **Localizar a multa / AIT**
       - Exibir número da AIT (`item.aitNumber`) em destaque.
    5. **Iniciar o recurso**
       - Orientar a procurar por “Recurso à JARI”, “2ª instância” ou equivalente.
    6. **Colar ou anexar o recurso**
       - Orientar a colar o texto ou anexar o PDF gerado.
    7. **Confirmar e salvar protocolo**
       - Recomendar anotar/printar o número de protocolo.

- Ações no rodapé:
  - Botão primário: **“Copiar link do sistema do órgão”** (usa `JARILinkBuilder` e copia `link.url`).
  - Botão secundário: **“Concluir”** (fecha modal).

---

## 4. Integração no `RecursoJARIModal`

**Arquivo:** `src/components/status/RecursoJARIModal.tsx`

1. **Importar e usar `buildJARILink`**
   - A partir de `item.input.issuingBody` / `issuingBodyCode` / UF (se disponíveis).
   - Guardar o `JARILink` em uma constante dentro do componente.

2. **Substituir/estender o botão “Salvar e enviar recurso à JARI”**
   - Em vez de tentar “enviar” diretamente:
     - Manter a lógica que salva o texto do recurso no storage.
     - Remover qualquer tentativa de envio “automático”.
     - Após salvar, abrir:
       - `JARIExportSheet` **ou**
       - `JARIGuideModal` (que por sua vez pode abrir o sheet de exportação).

3. **Adicionar acesso ao guia a partir do Status**
   - Na aba `Status`, para itens com `status === 'indeferido'` e com `recursoJARI` já gerado:
     - Mostrar um botão ou link “Ver passo a passo de envio”.
     - Ao tocar, abrir `JARIGuideModal` alimentado pelo `item`.

---

## 5. Mensagens e avisos legais

**Objetivo:** manter a coerência com os avisos já usados no app (e em `DefenseBuilder`).

- Ao gerar o texto do recurso:
  - Já existe um cabeçalho de aviso legal em `DefenseBuilder` → manter.
- No `RecursoJARIModal`:
  - Deixar visível um texto curto:
    - “Conteúdo técnico-informacional. Não constitui orientação jurídica nem garante êxito administrativo ou judicial.”
- No `JARIGuideModal`:
  - Repetir uma versão reduzida do aviso no rodapé.

---

## 6. Roadmap de entrega (ordem sugerida)

1. **Infraestrutura de links**
   - Criar `orgaoLinks.ts` + `JARILinkBuilder.ts`.
   - Testar manualmente `buildJARILink` em alguns órgãos fictícios.

2. **Mostrar link do sistema do órgão**
   - Usar `JARILinkBuilder` dentro de `RecursoJARIModal`.
   - Adicionar exibição do `link.label` + botão para **copiar o link** (sem abrir automaticamente).

3. **`JARIExportSheet`**
   - Implementar opções de copiar texto e abrir e-mail pré-preenchido.
   - Conectar ao modal de Recurso (botão “Exportar recurso”).

4. **`JARIGuideModal` (passo a passo)**
   - Implementar UI com passos numerados e botões para abrir exportação e copiar link do sistema.
   - Integrar a partir da aba `Status` e do próprio `RecursoJARIModal`.

5. **PDF (opcional)**
   - Adicionar dependências (`expo-print`, `expo-sharing`).
   - Implementar `JARIPdfExporter` e integrar como opção extra em `JARIExportSheet`.

---

Com este plano implementado, o app:
- Continua responsável por **analisar**, **gerar** e **organizar** o recurso à JARI.
- Passa a **ensinar o passo a passo** detalhado de envio.
- Fornece **atalhos práticos** (texto, e-mail, PDF, link para o sistema).
- Deixa o **envio final** sob responsabilidade do usuário, alinhado às limitações dos sistemas externos.


# Não Tome Multa

Aplicativo mobile para auxiliar o cidadão na análise técnica de multas de trânsito e na elaboração de defesas e recursos administrativos com base em inconsistências formais no auto de infração (CTB, Resoluções CONTRAN e normas aplicáveis).

---

## Funções do aplicativo

### Início
- **Boas-vindas** e acesso rápido às ações principais.
- **Cadastro técnico**: condutor e veículo são pré-requisito para usar análise e defesas. Sem perfil técnico, o app orienta o usuário a preenchê-lo.
- **Análise de multa**: a partir do Início, o usuário informa os dados do Auto de Infração de Trânsito (AIT). O sistema analisa o preenchimento e, se houver inconsistências técnicas (ex.: ausência de identificação do agente, do RENAINF, do equipamento, aferição vencida etc.), o registro é salvo e encaminhado para a aba **Defesas**.
- **Notificações**: ícone de notificação no header com contagem de atualizações não lidas das multas enviadas. Ao abrir, o usuário vê o resumo dos status (defesa enviada, em análise, deferido, indeferido) com títulos por tipo.
- **Assinatura**: usuários sem plano ativo veem um banner para assinar; com plano ativo, o card de análise de multa fica disponível.

### Cadastro técnico (perfil técnico)
- **Condutor**: nome completo, CPF, número e categoria da CNH, validade e UF emissora.
- **Veículo**: placa, RENAVAM, marca, modelo, cor, município e UF de registro.
- Os dados são usados para personalizar os textos de defesa prévia e de recurso à JARI (nome, documento, veículo etc.).
- O usuário pode excluir o perfil; nesse caso, a análise de multas deixa de ser oferecida até um novo cadastro.

### Análise técnica
- **Entrada**: número do AIT, RENAINF, código e descrição da infração, órgão autuador e julgador, identificação do agente, do equipamento (quando aplicável), data de aferição do equipamento, data da infração e observações.
- **Motor de análise**: confronto dos dados informados com um catálogo de regras de inconsistência (Art. 280 do CTB, Resoluções CONTRAN, prazos de aferição etc.). Cada regra possui severidade, base legal e modelo de texto para defesa e recurso.
- **Resultado**: se não houver inconsistências, o fluxo encerra; se houver, o registro é salvo com os achados e o usuário é direcionado à aba Defesas para gerar e enviar a defesa.

### Defesas
- Lista das multas analisadas que apresentaram inconsistências.
- Para cada item: dados do AIT, resumo da análise e inconsistências detectadas.
- **Gerar defesa**: geração da **Defesa Prévia** com base no perfil técnico, nos achados e nos modelos do catálogo (variáveis substituídas automaticamente).
- **Salvar defesa**: grava o texto no registro e fecha o modal.
- **Compartilhar / Enviar**: abre o compartilhamento do sistema (e-mail, apps etc.) com o texto da defesa. Após o envio, o item sai da aba Defesas e passa a aparecer na aba **Status** para acompanhamento.
- O usuário pode excluir o registro de defesa (remove da lista).

### Status das multas enviadas
- Lista das multas cuja defesa (ou recurso) foi enviada ao órgão, com status: **Enviada**, **Em análise**, **Deferido**, **Indeferido** ou **Cancelado**.
- Cada card exibe AIT, descrição, status, data de atualização e mensagem informativa.
- **Recurso à JARI**: para itens com status **Indeferido**, o app oferece a opção de gerar o **Recurso à JARI** com o mesmo motor de defesas (achados + perfil + modelos). O texto é exibido no modal; o usuário pode **Salvar e enviar recurso à JARI** (persiste o recurso e abre o compartilhamento) ou **Voltar** / **Excluir registro**.
- Notificações na Home refletem as atualizações dessa aba (novos status ou novos itens).

### Assinatura
- Tela de planos (ex.: plano mensal) com benefícios: análise técnica, defesa prévia, recurso à JARI, histórico e compartilhamento.
- Checkout para ativação da assinatura; o estado de assinatura ativa libera o uso da análise na Home.

### Termos e privacidade
- Tela institucional com informações sobre termos de uso e política de privacidade.

### Configurações
- Acesso a preferências e opções da conta (incluindo saída/conta conforme implementação).

---

## Aviso legal
Os textos gerados (Defesa Prévia e Recurso à JARI) têm caráter **técnico-informacional**. Não constituem orientação jurídica e não garantem êxito administrativo ou judicial. O usuário deve consultar um advogado especializado em direito de trânsito para orientação profissional.

---

## Stack técnica
- **Expo** (React Native)
- **expo-router** para navegação (tabs: Início, Defesas, Status)
- **Clerk** para autenticação
- **AsyncStorage** para persistência local (perfil técnico, defesas, status das multas, assinatura)
- **NativeWind (Tailwind)** para estilos

---

## Como executar
- Instalar dependências: `npm install`
- Iniciar: `npx expo start`
- Opções: `npx expo start --android` ou `npx expo start --ios` conforme o ambiente configurado.

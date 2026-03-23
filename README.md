# 🤖 WhatsApp Bot Boilerplate — Node.js

> Template profissional e pronto para produção para criar agentes de WhatsApp com fluxos de atendimento, menus interativos e integração com IA.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/whatsapp--web.js-1.34+-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

---

## ✨ Por que usar este template?

- ✅ **Sessão salva** — faça o login via QR Code apenas uma vez
- ✅ **Sistema de fluxos e menus** — navegação por números e palavras-chave
- ✅ **Sessões por usuário** — cada pessoa tem seu próprio estado de conversa
- ✅ **Textos centralizados** — edite todas as mensagens em um único arquivo
- ✅ **Estrutura modular** — fácil de escalar e adicionar novas funcionalidades
- ✅ **Pronto para IA** — estrutura preparada para plugar OpenAI, Gemini ou Claude

---

## 📁 Estrutura do Projeto

```
template-bot-whatsapp/
├── src/
│   ├── flows/
│   │   ├── router.js        # Roteador central — toda mensagem passa por aqui
│   │   └── mainMenu.js      # Fluxo do menu principal com sessões por usuário
│   ├── commands/
│   │   └── ping.js          # Exemplo de comando por palavra-chave
│   ├── middlewares/
│   │   └── logger.js        # Log de mensagens no terminal
│   └── utils/
│       └── messages.js      # ⭐ Todos os textos do bot em um só lugar
├── index.js                 # Ponto de entrada — inicializa o cliente
├── .env.example             # Variáveis de ambiente de exemplo
├── .gitignore
└── package.json
```

---

## 🚀 Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/ericnacif/template-bot-whatsapp.git
cd template-bot-whatsapp
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações.

### 4. Inicie o bot

```bash
node index.js
```

### 5. Escaneie o QR Code

Abra o WhatsApp no celular → **Dispositivos conectados** → **Conectar dispositivo** → escaneie o QR Code que aparece no terminal.

> 💡 A sessão é salva localmente. Você só precisa escanear uma vez.

---

## 💬 Como funciona o sistema de fluxos

O bot funciona com um sistema de **sessões por usuário** + **roteamento por etapas**.

### Palavras-chave (iniciam o atendimento)
```
oi / olá / opa / menu / início / start
```

### Navegação por menu
```
Usuário: oi
Bot: Menu principal (opções 1, 2, 3)

Usuário: 1
Bot: Submenu de Informações (opções 1, 2, 0)

Usuário: 0
Bot: Volta ao menu principal
```

### Fluxo visual

```
[Usuário digita "oi"]
        │
        ▼
  [Menu Principal]
  1 - Informações
  2 - Contato
  3 - Encerrar
        │
    ┌───┴───┐
    ▼       ▼
[Submenu] [Contato]
```

---

## 🛠️ Como personalizar

### Alterar os textos do bot

Edite o arquivo `src/utils/messages.js`. Todos os textos estão centralizados lá.

```js
const MESSAGES = {
    mainMenu: `👋 Olá! Como posso ajudar?

*1* - Produtos
*2* - Suporte
*3* - Encerrar`,
    // ...
};
```

### Adicionar um novo comando por palavra-chave

1. Crie um arquivo em `src/commands/meuComando.js`:

```js
async function meuComando(message) {
    return message.reply('Resposta do meu comando!');
}
module.exports = { meuComando };
```

2. Registre no `src/flows/router.js`:

```js
const { meuComando } = require('../commands/meuComando');

// ...
if (body === 'minha-palavra') {
    return meuComando(message);
}
```

### Adicionar uma nova opção no menu

Em `src/flows/mainMenu.js`, adicione um novo `case` no switch correspondente:

```js
case '4':
    session.step = 'idle';
    return message.reply(MESSAGES.minhaNovaOpcao);
```

---

## 🤖 Integrando com IA (OpenAI / Gemini / Claude)

A estrutura está preparada para isso. Instale o SDK desejado e chame dentro de um fluxo:

```bash
npm install openai
```

```js
// src/flows/iaFlow.js
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function iaFlow(message) {
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message.body }],
    });
    return message.reply(completion.choices[0].message.content);
}
```

Depois registre no `router.js` como qualquer outro fluxo.

---

## 📦 Dependências

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) | ^1.34.6 | Interface não-oficial para WhatsApp Web |
| [qrcode-terminal](https://github.com/gtanner/qrcode-terminal) | ^0.12.0 | Exibe QR Code no terminal |

---

## ⚠️ Aviso

Este projeto utiliza automação unofficial do WhatsApp. Use com responsabilidade e de acordo com os [Termos de Serviço do WhatsApp](https://www.whatsapp.com/legal/terms-of-service). Não utilize para spam.

---

## 📄 Licença

MIT © [Eric Nacif](https://github.com/ericnacif)

---

<p align="center">
  Se este template te ajudou, deixe uma ⭐ — isso ajuda muito!
</p>
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
- ✅ **Registro de comandos** — adicione comandos sem mexer no roteador
- ✅ **Sessões com TTL** — estado expira automaticamente e é trocável por Redis/DB
- ✅ **Rate limiting** — proteção básica contra flood por usuário
- ✅ **Logs estruturados** — saída em JSON pronta para observabilidade
- ✅ **Testes com Vitest + ESLint/Prettier** — qualidade desde o início
- ✅ **Pronto para IA** — estrutura preparada para plugar OpenAI, Gemini ou Claude

---

## 📁 Estrutura do Projeto

```
template-bot-whatsapp/
├── src/
│   ├── flows/
│   │   ├── router.js         # Roteador central — toda mensagem passa por aqui
│   │   ├── mainMenu.js       # Fluxo do menu principal com sessões por usuário
│   │   └── iaFlow.js         # Guia para plugar IA (OpenAI/Gemini/Claude)
│   ├── commands/
│   │   ├── index.js          # Registro de comandos (keyword → handler)
│   │   └── ping.js           # Exemplo de comando por palavra-chave
│   ├── middlewares/
│   │   ├── logger.js         # Logger estruturado (JSON) com níveis
│   │   └── rateLimiter.js    # Rate limiting por usuário
│   ├── utils/
│   │   ├── messages.js       # ⭐ Todos os textos do bot em um só lugar
│   │   └── sessionStore.js   # Sessões em memória com TTL (trocável por Redis/DB)
│   └── config.js             # Configuração lida do .env
├── tests/                    # Testes (Vitest)
├── index.js                  # Ponto de entrada — inicializa o cliente
├── .env.example              # Variáveis de ambiente de exemplo
├── eslint.config.mjs         # Configuração do ESLint
├── .prettierrc.json          # Configuração do Prettier
├── vitest.config.mjs         # Configuração de testes
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

Edite o `.env` com suas configurações. As variáveis disponíveis:

| Variável                    | Padrão   | Descrição                                    |
| --------------------------- | -------- | -------------------------------------------- |
| `SESSION_TTL_MINUTES`       | `30`     | Tempo de vida da sessão de conversa          |
| `SESSION_DRIVER`            | `memory` | Onde guardar sessões: `memory` ou `redis`    |
| `REDIS_URL`                 | —        | URL do Redis (quando `SESSION_DRIVER=redis`) |
| `RATE_LIMIT_WINDOW_SECONDS` | `10`     | Janela do rate limit                         |
| `RATE_LIMIT_MAX_MESSAGES`   | `5`      | Máximo de mensagens por janela               |
| `LOG_LEVEL`                 | `info`   | Nível de log: `error`/`warn`/`info`/`debug`  |
| `OPENAI_API_KEY`            | —        | Chave da OpenAI (opcional)                   |
| `GEMINI_API_KEY`            | —        | Chave do Gemini (opcional)                   |
| `ANTHROPIC_API_KEY`         | —        | Chave da Anthropic/Claude (opcional)         |

### 4. Inicie o bot

```bash
npm start       # produção
npm run dev     # com auto-reload (node --watch)
```

### 5. Escaneie o QR Code

Abra o WhatsApp no celular → **Dispositivos conectados** → **Conectar dispositivo** → escaneie o QR Code que aparece no terminal.

> 💡 A sessão é salva localmente. Você só precisa escanear uma vez.

---

## 🧪 Testar sem WhatsApp

Quer validar os menus e comandos sem conectar um número? Use o simulador:

```bash
npm run simulate
```

Ele abre um chat no terminal usando o mesmo `router`/`mainMenu` de produção —
digite `oi`, `1`, `ping` etc. e veja as respostas. Use `/sair` para encerrar.

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

2. Registre no `src/commands/index.js`:

```js
const { meuComando } = require('./meuComando');

const commands = {
    ping: pingCommand,
    'minha-palavra': meuComando,
};
```

O roteador resolve o comando automaticamente — você não precisa tocar no `router.js`.

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

## 💾 Persistência de sessão

Por padrão as sessões ficam em memória (`SESSION_DRIVER=memory`) e expiram pelo
`SESSION_TTL_MINUTES`. Para sobreviver a reinícios e rodar com múltiplas instâncias,
use Redis:

```bash
SESSION_DRIVER=redis
REDIS_URL=redis://127.0.0.1:6379
```

Os dois drivers usam a mesma interface (`get`/`set`/`reset`), então os fluxos não mudam.

---

## 🐳 Docker

```bash
docker build -t template-bot-whatsapp .
docker run -it --rm -v "$(pwd)/.wwebjs_auth:/app/.wwebjs_auth" template-bot-whatsapp
```

O `Dockerfile` já instala o Chromium e as dependências de sistema do `whatsapp-web.js`.
O volume preserva a sessão autenticada entre execuções.

---

## 🧪 Scripts

| Comando              | O que faz                                 |
| -------------------- | ----------------------------------------- |
| `npm start`          | Inicia o bot                              |
| `npm run dev`        | Inicia com auto-reload (`node --watch`)   |
| `npm run simulate`   | Testa os fluxos no terminal, sem WhatsApp |
| `npm test`           | Roda os testes (Vitest)                   |
| `npm run test:watch` | Testes em modo watch                      |
| `npm run lint`       | Verifica o código com ESLint              |
| `npm run format`     | Formata o código com Prettier             |

---

## 📦 Dependências

| Pacote                                                            | Versão  | Descrição                               |
| ----------------------------------------------------------------- | ------- | --------------------------------------- |
| [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) | ^1.34.6 | Interface não-oficial para WhatsApp Web |
| [qrcode-terminal](https://github.com/gtanner/qrcode-terminal)     | ^0.12.0 | Exibe QR Code no terminal               |
| [dotenv](https://github.com/motdotla/dotenv)                      | ^16.4.7 | Carrega variáveis de ambiente do `.env` |
| [redis](https://github.com/redis/node-redis)                      | ^4.7.0  | Persistência de sessão (driver Redis)   |

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

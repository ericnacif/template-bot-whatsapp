/**
 * ============================================================
 *  Integração com IA — escolha o provedor que preferir
 * ============================================================
 *
 * Para ativar, siga os passos:
 *
 * 1. Instale o SDK do provedor escolhido:
 *    OpenAI:    npm install openai
 *    Gemini:    npm install @google/generative-ai
 *    Claude:    npm install @anthropic-ai/sdk
 *
 * 2. Copie o .env.example para .env:
 *    cp .env.example .env
 *
 * 3. Preencha a chave de API no .env
 *
 * 4. Descomente o bloco do provedor escolhido abaixo
 *
 * 5. No router.js, importe e use iaFlow:
 *    const { iaFlow } = require('./iaFlow');
 *    // e adicione no final do handleMessage:
 *    return iaFlow(message);
 * ============================================================
 */

// ------------------------------------------------------------
// OPÇÃO 1 — OpenAI (ChatGPT)
// npm install openai
// .env: OPENAI_API_KEY=sk-...
// ------------------------------------------------------------

// const OpenAI = require('openai');
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//
// async function iaFlow(message) {
//     const completion = await openai.chat.completions.create({
//         model: 'gpt-4o-mini',
//         messages: [{ role: 'user', content: message.body }],
//     });
//     return message.reply(completion.choices[0].message.content);
// }

// ------------------------------------------------------------
// OPÇÃO 2 — Google Gemini
// npm install @google/generative-ai
// .env: GEMINI_API_KEY=...
// ------------------------------------------------------------

// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//
// async function iaFlow(message) {
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const result = await model.generateContent(message.body);
//     return message.reply(result.response.text());
// }

// ------------------------------------------------------------
// OPÇÃO 3 — Anthropic (Claude)
// npm install @anthropic-ai/sdk
// .env: ANTHROPIC_API_KEY=sk-ant-...
// ------------------------------------------------------------

// const Anthropic = require('@anthropic-ai/sdk');
// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
//
// async function iaFlow(message) {
//     const response = await anthropic.messages.create({
//         model: 'claude-haiku-4-5-20251001',
//         max_tokens: 1024,
//         messages: [{ role: 'user', content: message.body }],
//     });
//     return message.reply(response.content[0].text);
// }

// ------------------------------------------------------------
// Descomente a linha abaixo após escolher um provedor:
// ------------------------------------------------------------
// module.exports = { iaFlow };
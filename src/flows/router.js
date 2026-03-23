const { mainMenuFlow } = require('./mainMenu');
const { pingCommand } = require('../commands/ping');
const { logMessage } = require('../middlewares/logger');

/**
 * Roteador central de mensagens.
 * Toda mensagem recebida passa por aqui antes de ser processada.
 *
 * Fluxo:
 * 1. Loga a mensagem recebida
 * 2. Verifica palavras-chave (comandos diretos)
 * 3. Delega para o fluxo de menu se nenhum comando for reconhecido
 */
async function handleMessage(client, message) {
    const body = message.body.trim().toLowerCase();

    // 1. Log
    logMessage(message);

    // 2. Comandos por palavra-chave
    if (body === 'ping') {
        return pingCommand(message);
    }

    // 3. Fluxo principal de menu (números e opções)
    return mainMenuFlow(message);
}

module.exports = { handleMessage };
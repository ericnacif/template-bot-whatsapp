const { mainMenuFlow } = require('./mainMenu');
const { resolveCommand } = require('../commands');
const { logMessage } = require('../middlewares/logger');

/**
 * Roteador central de mensagens.
 * Toda mensagem recebida passa por aqui antes de ser processada.
 *
 * Fluxo:
 * 1. Loga a mensagem recebida
 * 2. Procura um comando por palavra-chave no registro de comandos
 * 3. Delega para o fluxo de menu se nenhum comando for reconhecido
 */
async function handleMessage(client, message) {
    const body = message.body.trim().toLowerCase();

    logMessage(message);

    const command = resolveCommand(body);
    if (command) {
        return command(message);
    }

    return mainMenuFlow(message);
}

module.exports = { handleMessage };

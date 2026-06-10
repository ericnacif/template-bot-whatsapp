const { pingCommand } = require('./ping');

/**
 * Registro de comandos por palavra-chave.
 *
 * Para adicionar um novo comando:
 * 1. Crie o handler em src/commands/meuComando.js
 * 2. Importe e registre a palavra-chave aqui
 *
 * Assim o router não precisa de uma cadeia de if/else crescente.
 */
const commands = {
    ping: pingCommand,
};

/**
 * Resolve o handler para um texto. Retorna null se não houver comando.
 */
function resolveCommand(body) {
    return commands[body] || null;
}

module.exports = { commands, resolveCommand };

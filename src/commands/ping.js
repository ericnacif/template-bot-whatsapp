/**
 * Comando: ping
 * Uso: usuário digita "ping"
 * Resposta: "pong 🏓"
 *
 * Use este arquivo como base para criar novos comandos por palavra-chave.
 * Depois registre o novo comando no flows/router.js
 */
async function pingCommand(message) {
    return message.reply('pong 🏓 Bot funcionando perfeitamente!');
}

module.exports = { pingCommand };
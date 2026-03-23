/**
 * Middleware de log de mensagens.
 * Exibe no terminal cada mensagem recebida com timestamp e remetente.
 */
function logMessage(message) {
    const time = new Date().toLocaleTimeString('pt-BR');
    const from = message.from.replace('@c.us', '');
    console.log(`[${time}] 📩 De: +${from} | "${message.body}"`);
}

module.exports = { logMessage };
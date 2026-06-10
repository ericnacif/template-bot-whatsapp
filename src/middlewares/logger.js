/**
 * Logger estruturado com níveis.
 * Cada linha sai como JSON para facilitar coleta/observabilidade em produção,
 * mantendo um resumo legível no terminal durante o desenvolvimento.
 */
const { config } = require('../config');

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

function shouldLog(level) {
    const current = LEVELS[config.logLevel] ?? LEVELS.info;
    return LEVELS[level] <= current;
}

function emit(level, message, meta = {}) {
    if (!shouldLog(level)) return;
    const entry = {
        ts: new Date().toISOString(),
        level,
        message,
        ...meta,
    };
    const line = JSON.stringify(entry);
    if (level === 'error') console.error(line);
    else if (level === 'warn') console.warn(line);
    else console.log(line);
}

const logInfo = (message, meta) => emit('info', message, meta);
const logWarn = (message, meta) => emit('warn', message, meta);
const logError = (message, meta) => emit('error', message, meta);
const logDebug = (message, meta) => emit('debug', message, meta);

/**
 * Loga uma mensagem recebida de um usuário.
 */
function logMessage(message) {
    const from = String(message.from || '').replace(/@(c\.us|lid)$/, '');
    logInfo('message_received', { from, body: message.body });
}

module.exports = { logMessage, logInfo, logWarn, logError, logDebug };

const { config } = require('../config');

/**
 * Rate limiter simples por usuário, baseado em janela deslizante.
 *
 * Evita que uma pessoa dispare muitos fluxos em sequência (flood).
 * Mantém em memória os timestamps recentes de cada usuário.
 */
class RateLimiter {
    constructor({
        windowMs = config.rateLimit.windowMs,
        maxMessages = config.rateLimit.maxMessages,
    } = {}) {
        this.windowMs = windowMs;
        this.maxMessages = maxMessages;
        this.hits = new Map();
    }

    /**
     * Registra uma tentativa e informa se o usuário está dentro do limite.
     * @returns {boolean} true se a mensagem pode ser processada.
     */
    allow(userId) {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        const recent = (this.hits.get(userId) || []).filter((ts) => ts > windowStart);
        recent.push(now);
        this.hits.set(userId, recent);

        return recent.length <= this.maxMessages;
    }

    /**
     * Remove registros de usuários sem atividade recente, evitando que o Map
     * cresça indefinidamente com quem parou de enviar mensagens.
     */
    sweep() {
        const windowStart = Date.now() - this.windowMs;
        for (const [userId, timestamps] of this.hits) {
            const recent = timestamps.filter((ts) => ts > windowStart);
            if (recent.length === 0) {
                this.hits.delete(userId);
            } else {
                this.hits.set(userId, recent);
            }
        }
    }
}

const rateLimiter = new RateLimiter();

module.exports = { rateLimiter, RateLimiter };

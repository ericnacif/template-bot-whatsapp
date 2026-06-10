const { config } = require('../config');

/**
 * Armazenamento de sessões por usuário com expiração (TTL).
 *
 * Implementação padrão em memória. Para produção com múltiplas instâncias,
 * crie outro store que respeite a mesma interface (get/set/reset) usando
 * Redis ou banco de dados, sem precisar tocar nos fluxos.
 */
class InMemorySessionStore {
    constructor({ ttlMs = config.session.ttlMs } = {}) {
        this.ttlMs = ttlMs;
        this.sessions = new Map();
    }

    /**
     * Retorna a sessão do usuário, criando uma nova se não existir
     * ou se a anterior expirou.
     */
    get(userId) {
        const now = Date.now();
        const existing = this.sessions.get(userId);

        if (existing && now - existing.updatedAt <= this.ttlMs) {
            existing.updatedAt = now;
            return existing.data;
        }

        const data = { step: 'idle' };
        this.sessions.set(userId, { data, updatedAt: now });
        return data;
    }

    /**
     * Persiste o estado da sessão e renova o TTL.
     */
    set(userId, data) {
        this.sessions.set(userId, { data, updatedAt: Date.now() });
        return data;
    }

    /**
     * Remove a sessão do usuário.
     */
    reset(userId) {
        this.sessions.delete(userId);
    }

    /**
     * Remove sessões expiradas. Útil para chamar periodicamente e
     * evitar crescimento indefinido de memória.
     */
    sweep() {
        const now = Date.now();
        for (const [userId, entry] of this.sessions) {
            if (now - entry.updatedAt > this.ttlMs) {
                this.sessions.delete(userId);
            }
        }
    }
}

const sessionStore = new InMemorySessionStore();

module.exports = { sessionStore, InMemorySessionStore };

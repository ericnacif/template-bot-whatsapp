const { createClient } = require('redis');
const { config } = require('../config');
const { logError, logInfo } = require('../middlewares/logger');

/**
 * Sessões persistidas em Redis, com expiração nativa (TTL).
 *
 * Mantém a mesma interface do InMemorySessionStore (get/set/reset/sweep),
 * então os fluxos não precisam saber qual driver está em uso.
 * Como o Redis é assíncrono, os métodos retornam Promises.
 */
class RedisSessionStore {
    constructor({ url = config.session.redisUrl, ttlMs = config.session.ttlMs } = {}) {
        this.ttlSeconds = Math.max(1, Math.round(ttlMs / 1000));
        this.client = createClient({ url });
        this.client.on('error', (err) => logError('redis_error', { error: err.message }));
        this.ready = this.client
            .connect()
            .then(() => logInfo('redis_connected'))
            .catch((err) => logError('redis_connect_failed', { error: err.message }));
    }

    key(userId) {
        return `session:${userId}`;
    }

    async get(userId) {
        await this.ready;
        const raw = await this.client.get(this.key(userId));
        if (!raw) {
            const data = { step: 'idle' };
            await this.set(userId, data);
            return data;
        }
        return JSON.parse(raw);
    }

    async set(userId, data) {
        await this.ready;
        await this.client.set(this.key(userId), JSON.stringify(data), { EX: this.ttlSeconds });
        return data;
    }

    async reset(userId) {
        await this.ready;
        await this.client.del(this.key(userId));
    }

    // O Redis expira as chaves sozinho via TTL; nada a varrer manualmente.
    async sweep() {}

    async disconnect() {
        try {
            await this.client.quit();
        } catch (error) {
            logError('redis_disconnect_failed', { error: error.message });
        }
    }
}

module.exports = { RedisSessionStore };

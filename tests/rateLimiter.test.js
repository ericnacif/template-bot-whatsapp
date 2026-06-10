const { RateLimiter } = require('../src/middlewares/rateLimiter');

describe('RateLimiter', () => {
    it('permite mensagens dentro do limite', () => {
        const limiter = new RateLimiter({ windowMs: 1000, maxMessages: 3 });
        expect(limiter.allow('u1')).toBe(true);
        expect(limiter.allow('u1')).toBe(true);
        expect(limiter.allow('u1')).toBe(true);
    });

    it('bloqueia ao ultrapassar o limite na janela', () => {
        const limiter = new RateLimiter({ windowMs: 1000, maxMessages: 2 });
        expect(limiter.allow('u1')).toBe(true);
        expect(limiter.allow('u1')).toBe(true);
        expect(limiter.allow('u1')).toBe(false);
    });

    it('isola o limite por usuário', () => {
        const limiter = new RateLimiter({ windowMs: 1000, maxMessages: 1 });
        expect(limiter.allow('u1')).toBe(true);
        expect(limiter.allow('u2')).toBe(true);
        expect(limiter.allow('u1')).toBe(false);
    });

    it('sweep remove usuários sem atividade recente', () => {
        const limiter = new RateLimiter({ windowMs: -1, maxMessages: 5 });
        limiter.allow('u1');
        expect(limiter.hits.has('u1')).toBe(true);
        // Com janela negativa, todo registro é considerado antigo.
        limiter.sweep();
        expect(limiter.hits.has('u1')).toBe(false);
    });
});

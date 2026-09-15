const { anonymizeUserId, logMessage } = require('../src/middlewares/logger');

describe('logger', () => {
    it('gera um identificador estável sem expor o número', () => {
        const phone = '5511999999999@c.us';
        const first = anonymizeUserId(phone, 'test-secret');
        const second = anonymizeUserId(phone, 'test-secret');

        expect(first).toBe(second);
        expect(first).not.toContain('5511999999999');
        expect(first).toHaveLength(16);
    });

    it('não inclui telefone nem conteúdo da mensagem por padrão', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
        const phone = '5511999999999@c.us';
        const body = 'meu dado privado';

        logMessage({ from: phone, body });

        const entry = JSON.parse(spy.mock.calls[0][0]);
        expect(entry.userHash).toBeDefined();
        expect(entry.bodyLength).toBe(Buffer.byteLength(body, 'utf8'));
        expect(entry).not.toHaveProperty('body');
        expect(spy.mock.calls[0][0]).not.toContain(phone);
        expect(spy.mock.calls[0][0]).not.toContain(body);
        spy.mockRestore();
    });
});

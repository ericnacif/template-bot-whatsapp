const { intFromEnv, boolFromEnv, enumFromEnv } = require('../src/config');

describe('config helpers', () => {
    afterEach(() => {
        delete process.env.TEST_INTEGER;
        delete process.env.TEST_BOOLEAN;
        delete process.env.TEST_ENUM;
    });

    it('rejeita inteiros inválidos', () => {
        process.env.TEST_INTEGER = '-1';
        expect(() => intFromEnv('TEST_INTEGER', 10)).toThrow(/inteiro/);
    });

    it('aceita apenas booleanos explícitos', () => {
        process.env.TEST_BOOLEAN = 'true';
        expect(boolFromEnv('TEST_BOOLEAN', false)).toBe(true);

        process.env.TEST_BOOLEAN = 'sim';
        expect(() => boolFromEnv('TEST_BOOLEAN', false)).toThrow(/true/);
    });

    it('rejeita valores fora da lista permitida', () => {
        process.env.TEST_ENUM = 'arquivo';
        expect(() => enumFromEnv('TEST_ENUM', 'memory', ['memory', 'redis'])).toThrow(/memory/);
    });
});

const { validateFlow } = require('../src/config/flowLoader');

describe('validateFlow', () => {
    it('aceita um fluxo mínimo válido', () => {
        const flow = {
            id: 'minimum',
            initialStep: 'start',
            nodes: { start: { type: 'message', message: 'Olá' } },
        };
        expect(validateFlow(flow)).toBe(flow);
    });

    it('rejeita initialStep inexistente', () => {
        expect(() => validateFlow({ id: 'broken', initialStep: 'missing', nodes: {} })).toThrow(
            /initialStep/,
        );
    });

    it('rejeita transições para nodes inexistentes', () => {
        expect(() =>
            validateFlow({
                id: 'broken',
                initialStep: 'start',
                nodes: {
                    start: {
                        type: 'menu',
                        message: 'Menu',
                        options: { 1: { next: 'missing' } },
                    },
                },
            }),
        ).toThrow(/inexistente/);
    });

    it('rejeita handoff para node inexistente', () => {
        expect(() =>
            validateFlow({
                id: 'broken-handoff',
                initialStep: 'start',
                handoff: { node: 'missing' },
                nodes: { start: { type: 'message', message: 'Olá' } },
            }),
        ).toThrow(/handoff/);
    });
});

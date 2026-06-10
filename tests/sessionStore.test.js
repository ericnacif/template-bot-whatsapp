const { InMemorySessionStore } = require('../src/utils/sessionStore');

describe('InMemorySessionStore', () => {
    it('cria uma sessão idle por padrão', () => {
        const store = new InMemorySessionStore({ ttlMs: 1000 });
        const session = store.get('user-1');
        expect(session.step).toBe('idle');
    });

    it('persiste alterações de estado', () => {
        const store = new InMemorySessionStore({ ttlMs: 1000 });
        const session = store.get('user-1');
        session.step = 'main_menu';
        store.set('user-1', session);
        expect(store.get('user-1').step).toBe('main_menu');
    });

    it('expira a sessão após o TTL', () => {
        const store = new InMemorySessionStore({ ttlMs: -1 });
        const session = store.get('user-1');
        session.step = 'main_menu';
        store.set('user-1', session);
        // Com TTL negativo, qualquer leitura seguinte é considerada expirada.
        expect(store.get('user-1').step).toBe('idle');
    });

    it('reset remove a sessão', () => {
        const store = new InMemorySessionStore({ ttlMs: 1000 });
        const session = store.get('user-1');
        session.step = 'main_menu';
        store.set('user-1', session);
        store.reset('user-1');
        expect(store.get('user-1').step).toBe('idle');
    });
});

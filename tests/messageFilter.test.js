const { isPrivateChat, shouldIgnore } = require('../src/utils/messageFilter');

describe('messageFilter', () => {
    it('aceita conversas privadas nos formatos suportados', () => {
        expect(isPrivateChat('5511999999999@c.us')).toBe(true);
        expect(isPrivateChat('123456789@lid')).toBe(true);
    });

    it.each([
        [{ from: '123@g.us', body: 'oi' }, 'grupo'],
        [{ from: 'status@broadcast', body: 'oi' }, 'status'],
        [{ from: '123@c.us', body: '   ' }, 'mensagem vazia'],
        [{ from: '123@c.us', body: 'oi', fromMe: true }, 'mensagem própria'],
        [{ from: 'canal@newsletter', body: 'oi' }, 'origem não privada'],
    ])('ignora %s (%s)', (message) => {
        expect(shouldIgnore(message)).toBe(true);
    });

    it('processa texto recebido em conversa privada', () => {
        expect(shouldIgnore({ from: '123@c.us', body: 'oi', fromMe: false })).toBe(false);
    });
});

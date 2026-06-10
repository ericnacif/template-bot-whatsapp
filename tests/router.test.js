const { handleMessage } = require('../src/flows/router');
const { makeMessage } = require('./helpers');

describe('handleMessage (router)', () => {
    it('responde ao comando ping', async () => {
        const message = makeMessage('ping', '5511222220001@c.us');
        await handleMessage({}, message);
        expect(message.reply).toHaveBeenCalledTimes(1);
        expect(message.reply.mock.calls[0][0]).toMatch(/pong/i);
    });

    it('reconhece o comando de forma case-insensitive', async () => {
        const message = makeMessage('PING', '5511222220002@c.us');
        await handleMessage({}, message);
        expect(message.reply.mock.calls[0][0]).toMatch(/pong/i);
    });

    it('delega para o fluxo de menu quando não é um comando', async () => {
        const message = makeMessage('oi', '5511222220003@c.us');
        await handleMessage({}, message);
        expect(message.reply).toHaveBeenCalledTimes(1);
    });
});

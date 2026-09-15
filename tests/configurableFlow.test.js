const { configurableFlow } = require('../src/flows/configurableFlow');
const { loadFlow } = require('../src/config/flowLoader');
const { InMemorySessionStore } = require('../src/utils/sessionStore');
const { MemoryLeadStore } = require('../src/utils/leadStore');
const { makeMessage } = require('./helpers');

const flow = loadFlow('examples/pousada/flow.json');

function setup() {
    return {
        sessions: new InMemorySessionStore({ ttlMs: 60_000 }),
        leads: new MemoryLeadStore(),
        now: () => Date.UTC(2026, 8, 15, 12),
    };
}

async function send(body, user, dependencies) {
    const message = makeMessage(body, user);
    await configurableFlow(message, { flow, ...dependencies });
    return message;
}

describe('configurableFlow — exemplo de pousada', () => {
    it('captura e salva uma solicitação de reserva completa', async () => {
        const dependencies = setup();
        const user = '5511999990001@c.us';

        expect((await send('oi', user, dependencies)).reply).toHaveBeenCalledWith(
            expect.stringContaining('Pousada Serra Verde'),
        );
        expect((await send('2', user, dependencies)).reply).toHaveBeenCalledWith(
            expect.stringContaining('nome'),
        );
        expect((await send('Eric Nacif', user, dependencies)).reply).toHaveBeenCalledWith(
            expect.stringContaining('Eric Nacif'),
        );
        await send('20/10/2026', user, dependencies);
        await send('23/10/2026', user, dependencies);
        const confirmation = await send('2', user, dependencies);

        expect(confirmation.reply).toHaveBeenCalledWith(
            expect.stringContaining('Solicitação registrada'),
        );
        expect(dependencies.leads.leads).toHaveLength(1);
        expect(dependencies.leads.leads[0]).toMatchObject({
            flowId: 'pousada-serra-verde',
            contactId: user,
            name: 'Eric Nacif',
            checkin: '20/10/2026',
            checkout: '23/10/2026',
            guests: '2',
        });
    });

    it('rejeita uma data inválida sem avançar o fluxo', async () => {
        const dependencies = setup();
        const user = '5511999990002@c.us';
        await send('menu', user, dependencies);
        await send('2', user, dependencies);
        await send('Ana', user, dependencies);

        const invalid = await send('31/02/2026', user, dependencies);
        expect(invalid.reply).toHaveBeenCalledWith(expect.stringContaining('DD/MM/AAAA'));

        const valid = await send('01/11/2026', user, dependencies);
        expect(valid.reply).toHaveBeenCalledWith(expect.stringContaining('saída'));
    });

    it('exige que a saída seja posterior à entrada', async () => {
        const dependencies = setup();
        const user = '5511999990006@c.us';
        await send('menu', user, dependencies);
        await send('2', user, dependencies);
        await send('Ana', user, dependencies);
        await send('20/10/2026', user, dependencies);

        const invalid = await send('19/10/2026', user, dependencies);
        expect(invalid.reply).toHaveBeenCalledWith(expect.stringContaining('posterior'));

        const valid = await send('21/10/2026', user, dependencies);
        expect(valid.reply).toHaveBeenCalledWith(expect.stringContaining('hóspedes'));
    });

    it('pausa respostas durante o atendimento humano e menu reativa o bot', async () => {
        const dependencies = setup();
        const user = '5511999990003@c.us';
        await send('menu', user, dependencies);

        const handoff = await send('4', user, dependencies);
        expect(handoff.reply).toHaveBeenCalledWith(expect.stringContaining('pausado'));

        const duringHandoff = await send('Olá, atendente?', user, dependencies);
        expect(duringHandoff.reply).not.toHaveBeenCalled();

        const resumed = await send('menu', user, dependencies);
        expect(resumed.reply).toHaveBeenCalledWith(expect.stringContaining('Pousada Serra Verde'));
    });

    it('aceita uma palavra-chave de atendimento humano em qualquer etapa', async () => {
        const dependencies = setup();
        const user = '5511999990004@c.us';

        const handoff = await send('falar com atendente', user, dependencies);
        expect(handoff.reply).toHaveBeenCalledWith(expect.stringContaining('Atendimento humano'));
    });

    it('avisa quando uma opção de menu não existe', async () => {
        const dependencies = setup();
        const user = '5511999990005@c.us';
        await send('menu', user, dependencies);

        const invalid = await send('99', user, dependencies);
        expect(invalid.reply).toHaveBeenCalledWith(expect.stringContaining('Opção inválida'));
    });
});

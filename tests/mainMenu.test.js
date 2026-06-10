const { mainMenuFlow } = require('../src/flows/mainMenu');
const { MESSAGES } = require('../src/utils/messages');
const { makeMessage } = require('./helpers');

let counter = 0;
function uniqueUser() {
    counter += 1;
    return `5511000000${counter}@c.us`;
}

describe('mainMenuFlow', () => {
    it('responde com o menu principal ao receber uma palavra-chave de saudação', async () => {
        const message = makeMessage('oi', uniqueUser());
        await mainMenuFlow(message);
        expect(message.reply).toHaveBeenCalledWith(MESSAGES.mainMenu);
    });

    it('orienta o usuário quando escreve algo sem contexto', async () => {
        const message = makeMessage('qualquer coisa', uniqueUser());
        await mainMenuFlow(message);
        expect(message.reply).toHaveBeenCalledWith(MESSAGES.noContext);
    });

    it('navega do menu principal para o submenu de informações', async () => {
        const user = uniqueUser();

        const start = makeMessage('menu', user);
        await mainMenuFlow(start);
        expect(start.reply).toHaveBeenCalledWith(MESSAGES.mainMenu);

        const option = makeMessage('1', user);
        await mainMenuFlow(option);
        expect(option.reply).toHaveBeenCalledWith(MESSAGES.infoMenu);
    });

    it('retorna ao menu principal ao digitar 0 no submenu', async () => {
        const user = uniqueUser();
        await mainMenuFlow(makeMessage('menu', user));
        await mainMenuFlow(makeMessage('1', user));

        const back = makeMessage('0', user);
        await mainMenuFlow(back);
        expect(back.reply).toHaveBeenCalledWith(MESSAGES.mainMenu);
    });

    it('avisa opção inválida dentro do menu principal', async () => {
        const user = uniqueUser();
        await mainMenuFlow(makeMessage('menu', user));

        const invalid = makeMessage('99', user);
        await mainMenuFlow(invalid);
        expect(invalid.reply).toHaveBeenCalledWith(MESSAGES.invalidOption);
    });
});

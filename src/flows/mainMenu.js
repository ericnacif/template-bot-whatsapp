const { MESSAGES } = require('../utils/messages');
const { sessionStore } = require('../utils/sessionStore');

/**
 * Fluxo principal de menu com suporte a múltiplos níveis.
 * O estado de cada usuário vem do sessionStore (trocável por Redis/DB).
 * Adicione novos cases nos switches para expandir o bot.
 */
async function mainMenuFlow(message) {
    const userId = message.from;
    const body = message.body.trim();

    const session = sessionStore.get(userId);

    // --- Palavras que reiniciam o fluxo ---
    const triggerWords = ['oi', 'olá', 'ola', 'opa', 'menu', 'início', 'inicio', 'start'];
    if (triggerWords.includes(body.toLowerCase())) {
        session.step = 'main_menu';
        sessionStore.set(userId, session);
        return message.reply(MESSAGES.mainMenu);
    }

    // --- Navegação por step ---
    switch (session.step) {
        case 'main_menu':
            return handleMainMenu(message, session, userId);

        case 'submenu_info':
            return handleInfoSubmenu(message, session, userId);

        default:
            // Usuário escreveu algo sem contexto
            return message.reply(MESSAGES.noContext);
    }
}

async function handleMainMenu(message, session, userId) {
    switch (message.body.trim()) {
        case '1':
            session.step = 'submenu_info';
            sessionStore.set(userId, session);
            return message.reply(MESSAGES.infoMenu);

        case '2':
            session.step = 'idle';
            sessionStore.set(userId, session);
            return message.reply(MESSAGES.contactInfo);

        case '3':
            session.step = 'idle';
            sessionStore.set(userId, session);
            return message.reply(MESSAGES.farewell);

        default:
            return message.reply(MESSAGES.invalidOption);
    }
}

async function handleInfoSubmenu(message, session, userId) {
    switch (message.body.trim()) {
        case '1':
            session.step = 'idle';
            sessionStore.set(userId, session);
            return message.reply(MESSAGES.infoItem1);

        case '2':
            session.step = 'idle';
            sessionStore.set(userId, session);
            return message.reply(MESSAGES.infoItem2);

        case '0':
            session.step = 'main_menu';
            sessionStore.set(userId, session);
            return message.reply(MESSAGES.mainMenu);

        default:
            return message.reply(MESSAGES.invalidOption);
    }
}

module.exports = { mainMenuFlow };

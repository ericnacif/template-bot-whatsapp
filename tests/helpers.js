/* `vi` é global (vitest com globals: true). */

/**
 * Cria um objeto de mensagem fake compatível com whatsapp-web.js,
 * o suficiente para exercitar os fluxos sem conectar ao WhatsApp.
 */
function makeMessage(body, from = '551199999999@c.us') {
    return {
        from,
        body,
        reply: vi.fn().mockResolvedValue(undefined),
    };
}

module.exports = { makeMessage };

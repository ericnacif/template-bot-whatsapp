function isPrivateChat(from = '') {
    return from.endsWith('@c.us') || from.endsWith('@lid');
}

function shouldIgnore(message = {}) {
    const from = String(message.from || '');
    if (from.endsWith('@g.us')) return true;
    if (from === 'status@broadcast') return true;
    if (message.isStatus || message.broadcast || message.fromMe) return true;
    if (!isPrivateChat(from)) return true;
    if (!message.body || message.body.trim() === '') return true;
    return false;
}

module.exports = { isPrivateChat, shouldIgnore };

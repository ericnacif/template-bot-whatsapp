const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./src/flows/router');
const { rateLimiter } = require('./src/middlewares/rateLimiter');
const { sessionStore } = require('./src/utils/sessionStore');
const { MESSAGES } = require('./src/utils/messages');
const { logInfo, logWarn, logError } = require('./src/middlewares/logger');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Em containers, aponte para o Chromium do sistema via PUPPETEER_EXECUTABLE_PATH.
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});

client.on('qr', (qr) => {
    console.log('\n📱 Escaneie o QR Code abaixo com o seu WhatsApp:\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    logInfo('client_ready');
    console.log('✅ Bot conectado e pronto para atender!');
});

client.on('auth_failure', () => {
    logError('auth_failure');
    console.error('❌ Falha na autenticação. Delete a pasta .wwebjs_auth e tente novamente.');
});

client.on('disconnected', (reason) => {
    logWarn('client_disconnected', { reason });
});

function isPrivateChat(from) {
    // Aceita @c.us (formato antigo) e @lid (formato novo do WhatsApp)
    return from.endsWith('@c.us') || from.endsWith('@lid');
}

function shouldIgnore(message) {
    if (message.from.endsWith('@g.us')) return true; // grupos
    if (message.from === 'status@broadcast') return true;
    if (message.isStatus) return true;
    if (message.broadcast) return true;
    if (!isPrivateChat(message.from)) return true;
    if (!message.body || message.body.trim() === '') return true;
    if (message.fromMe) return true;
    return false;
}

async function processMessage(message) {
    if (shouldIgnore(message)) return;

    if (!rateLimiter.allow(message.from)) {
        logWarn('rate_limited', { from: message.from });
        try {
            await message.reply(MESSAGES.rateLimited);
        } catch (_) {
            /* ignora falha ao avisar sobre limite */
        }
        return;
    }

    try {
        await handleMessage(client, message);
    } catch (error) {
        logError('message_processing_failed', {
            from: message.from,
            error: error.message,
            stack: error.stack,
        });
        try {
            await message.reply(MESSAGES.error);
        } catch (_) {
            /* não conseguiu avisar o usuário; já registramos o erro original */
        }
    }
}

client.on('message', async (message) => {
    await processMessage(message);
});

// Limpa periodicamente sessões e registros antigos para evitar vazamento de memória.
const sweepInterval = setInterval(
    () => {
        sessionStore.sweep();
        rateLimiter.sweep();
    },
    5 * 60 * 1000,
);
sweepInterval.unref?.();

let shuttingDown = false;
async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logWarn('shutting_down', { signal });
    clearInterval(sweepInterval);
    try {
        await client.destroy();
        await sessionStore.disconnect?.();
    } catch (error) {
        logError('shutdown_failed', { error: error.message });
    } finally {
        process.exit(0);
    }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

client.initialize();

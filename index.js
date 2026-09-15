const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./src/flows/router');
const { rateLimiter } = require('./src/middlewares/rateLimiter');
const { sessionStore } = require('./src/utils/sessionStore');
const { MESSAGES } = require('./src/utils/messages');
const { KeyedQueue } = require('./src/utils/keyedQueue');
const { shouldIgnore } = require('./src/utils/messageFilter');
const { logInfo, logWarn, logError, anonymizeUserId } = require('./src/middlewares/logger');

const messageQueue = new KeyedQueue();

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

async function processMessage(message) {
    if (shouldIgnore(message)) return;

    if (!rateLimiter.allow(message.from)) {
        logWarn('rate_limited', { userHash: anonymizeUserId(message.from) });
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
            userHash: anonymizeUserId(message.from),
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

client.on('message', (message) => {
    messageQueue
        .enqueue(message.from, () => processMessage(message))
        .catch((error) => {
            logError('message_queue_failed', {
                userHash: anonymizeUserId(message.from),
                error: error.message,
            });
        });
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

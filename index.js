const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./src/flows/router');
const { logMessage } = require('./src/middlewares/logger');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('qr', (qr) => {
    console.log('\n📱 Escaneie o QR Code abaixo com o seu WhatsApp:\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot conectado e pronto para atender!');
});

client.on('auth_failure', () => {
    console.error('❌ Falha na autenticação. Delete a pasta .wwebjs_auth e tente novamente.');
});

client.on('disconnected', (reason) => {
    console.warn(`⚠️  Bot desconectado: ${reason}`);
});

function isPrivateChat(from) {
    // Aceita @c.us (formato antigo) e @lid (formato novo do WhatsApp)
    return from.endsWith('@c.us') || from.endsWith('@lid');
}

async function processMessage(message) {
    // Ignora grupos
    if (message.from.endsWith('@g.us')) return;

    // Ignora status e broadcasts
    if (message.from === 'status@broadcast') return;
    if (message.isStatus) return;
    if (message.broadcast) return;

    // Só responde conversas privadas
    if (!isPrivateChat(message.from)) return;

    // Ignora mensagens sem texto
    if (!message.body || message.body.trim() === '') return;

    // Ignora mensagens enviadas pelo próprio bot
    if (message.fromMe) return;

    try {
        logMessage(message);
        await handleMessage(client, message);
    } catch (error) {
        console.error(`Erro ao processar mensagem: ${error.message}`);
    }
}

client.on('message', async (message) => {
    await processMessage(message);
});

client.initialize();
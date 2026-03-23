const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./src/flows/router');
const { logMessage } = require('./src/middlewares/logger');

// Inicializa o cliente do WhatsApp com sessão salva localmente
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

// Gera o QR Code no terminal para escanear com o WhatsApp
client.on('qr', (qr) => {
    console.log('\n📱 Escaneie o QR Code abaixo com o seu WhatsApp:\n');
    qrcode.generate(qr, { small: true });
});

// Bot conectado com sucesso
client.on('ready', () => {
    console.log('✅ Bot conectado e pronto para atender!');
});

// Falha na autenticação
client.on('auth_failure', () => {
    console.error('❌ Falha na autenticação. Delete a pasta .wwebjs_auth e tente novamente.');
});

// Bot desconectado
client.on('disconnected', (reason) => {
    console.warn(`⚠️  Bot desconectado: ${reason}`);
});

// Processa cada mensagem recebida
client.on('message', async (message) => {
    // Ignora mensagens sem texto
    if (!message.body || message.body.trim() === '') return;

    // Ignora mensagens enviadas pelo próprio bot
    if (message.fromMe) return;

    // Ignora status do WhatsApp
    if (message.isStatus) return;

    // Ignora mensagens de grupos
    if (message.from.endsWith('@g.us')) return;

    // Ignora broadcasts e listas
    if (message.broadcast) return;

    // Só responde conversas privadas (1:1)
    if (!message.from.endsWith('@c.us')) return;

    try {
        logMessage(message);
        await handleMessage(client, message);
    } catch (error) {
        console.error(`Erro ao processar mensagem: ${error.message}`);
    }
});

// Inicializa o bot
client.initialize();
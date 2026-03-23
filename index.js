const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inicializa o cliente do WhatsApp configurado para salvar a sua sessão
const client = new Client({
    authStrategy: new LocalAuth()
});

// Gera o QR Code no terminal para você escanear
client.on('qr', (qr) => {
    console.log('📱 Escaneie o QR Code abaixo com o seu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Avisa quando a conexão foi feita com sucesso
client.on('ready', () => {
    console.log('✅ Tudo certo! O template do Bot está conectado e pronto.');
});

// O que o bot faz quando recebe uma mensagem
client.on('message', message => {
    console.log(`📩 Mensagem recebida: ${message.body}`);

    // Uma regrinha de teste: se alguém digitar "ping", ele responde
    if (message.body === 'ping') {
        message.reply('pong 🏓! O bot está funcionando perfeitamente.');
    }
});

// Dá a partida no bot
client.initialize();
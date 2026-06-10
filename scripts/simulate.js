/**
 * Simulador de conversa no terminal.
 *
 * Permite testar os fluxos do bot (menus, comandos) SEM conectar ao WhatsApp,
 * sem QR Code e sem número. Usa o mesmo router/mainMenu de produção, trocando
 * apenas o objeto `message` real por um falso que imprime as respostas.
 *
 * Uso: npm run simulate
 */

// Silencia os logs estruturados para a conversa ficar limpa no terminal.
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'error';

const readline = require('readline');
const { handleMessage } = require('../src/flows/router');

// Número fake fixo para a sessão persistir durante a conversa.
const FAKE_USER = '5511999999999@c.us';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'você > ',
});

function makeMessage(body) {
    return {
        from: FAKE_USER,
        body,
        fromMe: false,
        reply: (text) => {
            console.log(`\n🤖 bot >\n${text}\n`);
            return Promise.resolve();
        },
    };
}

console.log('💬 Simulador do bot (sem WhatsApp). Digite "oi" para começar.');
console.log('   Comandos do simulador: /sair para encerrar.\n');
rl.prompt();

// Fila para processar mensagens uma de cada vez (cada fluxo é assíncrono).
const queue = [];
let processing = false;
let closing = false;

async function pump() {
    if (processing) return;
    processing = true;

    while (queue.length > 0) {
        const input = queue.shift().trim();

        if (input === '/sair') {
            closing = true;
            queue.length = 0;
            break;
        }

        if (input !== '') {
            try {
                await handleMessage({}, makeMessage(input));
            } catch (error) {
                console.error(`\n⚠️  Erro no fluxo: ${error.message}\n`);
            }
        }
    }

    processing = false;

    if (closing) {
        console.log('\n👋 Simulador encerrado.');
        process.exit(0);
    } else {
        rl.prompt();
    }
}

rl.on('line', (line) => {
    queue.push(line);
    pump();
});

rl.on('close', () => {
    closing = true;
    pump();
});

/**
 * Centralize aqui todos os textos do bot.
 * Isso facilita a manutenção e evita textos espalhados pelo código.
 *
 * Dica: substitua os textos abaixo pelo conteúdo do seu negócio.
 */
const MESSAGES = {
    mainMenu: `👋 Olá! Bem-vindo(a)!

Como posso te ajudar hoje?

*1* - 📋 Informações
*2* - 📞 Contato
*3* - 👋 Encerrar atendimento

_Digite o número da opção desejada._`,

    infoMenu: `📋 *Informações*

Escolha o que deseja saber:

*1* - 🕐 Horário de funcionamento
*2* - 📍 Como nos encontrar

*0* - ↩️ Voltar ao menu principal`,

    contactInfo: `📞 *Contato*

Você pode nos chamar por aqui mesmo ou acessar nossos canais:

🌐 Site: https://seusite.com.br
📧 Email: contato@seusite.com.br
📸 Instagram: @seuinsta

_Retorne ao menu digitando *menu*._`,

    infoItem1: `🕐 *Horário de Funcionamento*

Segunda a Sexta: 08h às 18h
Sábado: 09h às 13h
Domingo: Fechado

_Retorne ao menu digitando *menu*._`,

    infoItem2: `📍 *Como nos Encontrar*

Rua Exemplo, 123 - Bairro - Cidade/UF

📌 Google Maps: https://maps.google.com

_Retorne ao menu digitando *menu*._`,

    farewell: `👋 *Até logo!*

Foi um prazer te atender. Se precisar de algo, é só chamar!

_Digite *oi* a qualquer momento para começar novamente._`,

    invalidOption: `⚠️ Opção inválida.

Por favor, digite apenas o *número* da opção desejada.
Para ver o menu novamente, digite *menu*.`,

    noContext: `👋 Olá! Para começar, digite *oi* ou *menu*.`,
};

module.exports = { MESSAGES };
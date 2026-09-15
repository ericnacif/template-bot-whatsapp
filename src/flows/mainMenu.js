const { config } = require('../config');
const { loadFlow } = require('../config/flowLoader');
const { configurableFlow } = require('./configurableFlow');

const activeFlow = loadFlow(config.bot.flowFile);

/**
 * Carrega o fluxo JSON ativo e o executa com o motor declarativo.
 * A sessão e a persistência de leads são selecionadas pela configuração.
 */
async function mainMenuFlow(message) {
    return configurableFlow(message, { flow: activeFlow });
}

module.exports = { mainMenuFlow };

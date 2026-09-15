const fs = require('node:fs');
const path = require('node:path');

function validateFlow(flow) {
    if (!flow || typeof flow !== 'object') throw new Error('O fluxo deve ser um objeto JSON.');
    if (!flow.id || typeof flow.id !== 'string') throw new Error('O fluxo precisa de um id.');
    if (!flow.initialStep || typeof flow.initialStep !== 'string') {
        throw new Error('O fluxo precisa de um initialStep.');
    }
    if (!flow.nodes || typeof flow.nodes !== 'object') {
        throw new Error('O fluxo precisa de um objeto nodes.');
    }
    if (!flow.nodes[flow.initialStep]) {
        throw new Error(`O initialStep "${flow.initialStep}" não existe em nodes.`);
    }
    if (flow.handoff?.node && !flow.nodes[flow.handoff.node]) {
        throw new Error(`O handoff aponta para "${flow.handoff.node}", que não existe.`);
    }

    for (const [nodeId, node] of Object.entries(flow.nodes)) {
        if (
            !node.type ||
            !['menu', 'input', 'message', 'handoff', 'save_lead'].includes(node.type)
        ) {
            throw new Error(`O node "${nodeId}" possui um type inválido.`);
        }

        if (node.options) {
            for (const option of Object.values(node.options)) {
                if (!option.next || !flow.nodes[option.next]) {
                    throw new Error(`Uma opção de "${nodeId}" aponta para um node inexistente.`);
                }
            }
        }

        if (node.next && !flow.nodes[node.next]) {
            throw new Error(`O node "${nodeId}" aponta para "${node.next}", que não existe.`);
        }
    }

    return flow;
}

function loadFlow(filePath) {
    const resolvedPath = path.resolve(process.cwd(), filePath);
    let content;

    try {
        content = fs.readFileSync(resolvedPath, 'utf8');
    } catch (error) {
        throw new Error(`Não foi possível carregar o fluxo em ${resolvedPath}: ${error.message}`);
    }

    try {
        return validateFlow(JSON.parse(content));
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`O fluxo em ${resolvedPath} não contém JSON válido: ${error.message}`);
        }
        throw error;
    }
}

module.exports = { loadFlow, validateFlow };

const http = require('node:http');
const { config } = require('../config');
const { logInfo, logError } = require('../middlewares/logger');

function startHealthServer({
    port = config.health.port,
    getStatus = () => ({ ready: false }),
} = {}) {
    const server = http.createServer((request, response) => {
        const status = getStatus();

        if (request.url === '/health') {
            return sendJson(response, 200, {
                status: 'ok',
                uptimeSeconds: Math.round(process.uptime()),
            });
        }

        if (request.url === '/ready') {
            return sendJson(response, status.ready ? 200 : 503, {
                status: status.ready ? 'ready' : 'not_ready',
                whatsapp: status.ready ? 'connected' : 'disconnected',
                queueSize: status.queueSize || 0,
            });
        }

        return sendJson(response, 404, { status: 'not_found' });
    });

    server.on('error', (error) => logError('health_server_failed', { error: error.message }));
    server.listen(port, '0.0.0.0', () => {
        const address = server.address();
        logInfo('health_server_ready', { port: address.port });
    });

    return server;
}

function sendJson(response, statusCode, body) {
    response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(body));
}

function closeHealthServer(server) {
    if (!server) return Promise.resolve();
    return new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
    });
}

module.exports = { startHealthServer, closeHealthServer, sendJson };

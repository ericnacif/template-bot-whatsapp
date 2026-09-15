const { once } = require('node:events');
const { startHealthServer, closeHealthServer } = require('../src/health/server');

describe('health server', () => {
    it('separa liveness de readiness do WhatsApp', async () => {
        let ready = false;
        const server = startHealthServer({ port: 0, getStatus: () => ({ ready, queueSize: 2 }) });
        await once(server, 'listening');
        const { port } = server.address();

        try {
            const health = await fetch(`http://127.0.0.1:${port}/health`);
            expect(health.status).toBe(200);

            const unavailable = await fetch(`http://127.0.0.1:${port}/ready`);
            expect(unavailable.status).toBe(503);
            expect(await unavailable.json()).toMatchObject({ queueSize: 2 });

            ready = true;
            const available = await fetch(`http://127.0.0.1:${port}/ready`);
            expect(available.status).toBe(200);
        } finally {
            await closeHealthServer(server);
        }
    });

    it('responde 404 para rotas desconhecidas', async () => {
        const server = startHealthServer({ port: 0 });
        await once(server, 'listening');
        const { port } = server.address();

        try {
            const response = await fetch(`http://127.0.0.1:${port}/missing`);
            expect(response.status).toBe(404);
        } finally {
            await closeHealthServer(server);
        }
    });
});

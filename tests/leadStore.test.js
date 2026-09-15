const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { FileLeadStore, MemoryLeadStore } = require('../src/utils/leadStore');

describe('leadStore', () => {
    it('armazena leads em memória', async () => {
        const store = new MemoryLeadStore();
        await store.save({ id: 'lead-1' });
        expect(store.leads).toEqual([{ id: 'lead-1' }]);
    });

    it('persiste um lead por linha em arquivo', async () => {
        const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'bot-leads-'));
        const filePath = path.join(directory, 'leads.ndjson');
        const store = new FileLeadStore({ filePath });

        try {
            await store.save({ id: 'lead-1', name: 'Eric' });
            await store.save({ id: 'lead-2', name: 'Ana' });
            const lines = (await fs.readFile(filePath, 'utf8')).trim().split('\n');

            expect(lines.map(JSON.parse)).toEqual([
                { id: 'lead-1', name: 'Eric' },
                { id: 'lead-2', name: 'Ana' },
            ]);
        } finally {
            await fs.rm(directory, { recursive: true, force: true });
        }
    });
});

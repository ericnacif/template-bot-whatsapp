const fs = require('node:fs/promises');
const path = require('node:path');
const { config } = require('../config');

class MemoryLeadStore {
    constructor() {
        this.leads = [];
    }

    async save(lead) {
        this.leads.push(lead);
        return lead;
    }
}

class FileLeadStore {
    constructor({ filePath = config.leads.filePath } = {}) {
        this.filePath = path.resolve(process.cwd(), filePath);
    }

    async save(lead) {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.appendFile(this.filePath, `${JSON.stringify(lead)}\n`, { mode: 0o600 });
        return lead;
    }
}

function createLeadStore() {
    if (config.leads.driver === 'memory') return new MemoryLeadStore();
    return new FileLeadStore();
}

const leadStore = createLeadStore();

module.exports = { leadStore, createLeadStore, MemoryLeadStore, FileLeadStore };

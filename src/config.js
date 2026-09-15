require('dotenv').config();

function intFromEnv(name, fallback, { min = 1 } = {}) {
    const raw = process.env[name];
    if (raw === undefined || raw === '') return fallback;
    const parsed = Number.parseInt(raw, 10);
    if (!/^\d+$/.test(raw) || Number.isNaN(parsed) || parsed < min) {
        throw new Error(`${name} deve ser um número inteiro maior ou igual a ${min}.`);
    }
    return parsed;
}

function boolFromEnv(name, fallback) {
    const raw = process.env[name];
    if (raw === undefined || raw === '') return fallback;
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    throw new Error(`${name} deve ser "true" ou "false".`);
}

function enumFromEnv(name, fallback, allowed) {
    const value = (process.env[name] || fallback).toLowerCase();
    if (!allowed.includes(value)) {
        throw new Error(`${name} deve ser um destes valores: ${allowed.join(', ')}.`);
    }
    return value;
}

const config = {
    bot: {
        flowFile: process.env.BOT_FLOW_FILE || 'config/flows/default.json',
    },
    session: {
        ttlMs: intFromEnv('SESSION_TTL_MINUTES', 30) * 60 * 1000,
        // 'memory' (padrão) ou 'redis'
        driver: enumFromEnv('SESSION_DRIVER', 'memory', ['memory', 'redis']),
        redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    },
    rateLimit: {
        windowMs: intFromEnv('RATE_LIMIT_WINDOW_SECONDS', 10) * 1000,
        maxMessages: intFromEnv('RATE_LIMIT_MAX_MESSAGES', 5),
    },
    logging: {
        level: enumFromEnv('LOG_LEVEL', 'info', ['error', 'warn', 'info', 'debug']),
        includeMessageBody: boolFromEnv('LOG_MESSAGE_BODY', false),
        hashSecret: process.env.LOG_HASH_SECRET || '',
    },
    leads: {
        driver: enumFromEnv('LEAD_STORE_DRIVER', 'file', ['file', 'memory']),
        filePath: process.env.LEAD_STORE_PATH || 'data/leads.ndjson',
    },
    health: {
        enabled: boolFromEnv('HEALTH_ENABLED', true),
        port: intFromEnv('HEALTH_PORT', 3000, { min: 0 }),
    },
    reconnect: {
        initialDelayMs: intFromEnv('RECONNECT_INITIAL_SECONDS', 5) * 1000,
        maxDelayMs: intFromEnv('RECONNECT_MAX_SECONDS', 60) * 1000,
    },
    ai: {
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        geminiApiKey: process.env.GEMINI_API_KEY || '',
        anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    },
};

module.exports = { config, intFromEnv, boolFromEnv, enumFromEnv };

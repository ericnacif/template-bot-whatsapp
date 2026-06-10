require('dotenv').config();

function intFromEnv(name, fallback) {
    const raw = process.env[name];
    if (raw === undefined || raw === '') return fallback;
    const parsed = Number.parseInt(raw, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}

const config = {
    session: {
        ttlMs: intFromEnv('SESSION_TTL_MINUTES', 30) * 60 * 1000,
    },
    rateLimit: {
        windowMs: intFromEnv('RATE_LIMIT_WINDOW_SECONDS', 10) * 1000,
        maxMessages: intFromEnv('RATE_LIMIT_MAX_MESSAGES', 5),
    },
    logLevel: process.env.LOG_LEVEL || 'info',
    ai: {
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        geminiApiKey: process.env.GEMINI_API_KEY || '',
        anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    },
};

module.exports = { config };

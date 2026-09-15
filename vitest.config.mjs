import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary'],
            include: ['src/**/*.js'],
            exclude: ['src/flows/iaFlow.js', 'src/utils/redisSessionStore.js'],
            thresholds: {
                statements: 75,
                branches: 70,
                functions: 75,
                lines: 75,
            },
        },
    },
});

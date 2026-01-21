import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    test: {
        environment: 'node',
        include: ['resources/js/**/*.test.ts', 'resources/js/**/*.test.tsx'],
        clearMocks: true,
        restoreMocks: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
});

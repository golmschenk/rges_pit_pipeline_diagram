import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    define: { 'process.env': {} },
    resolve: {
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
        ],
    },
    server: {
        port: 3000,
        open: true,
        cors: true,
    },
    base: './',
    plugins: [
        tailwindcss(),
    ],
})
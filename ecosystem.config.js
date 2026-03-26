module.exports = {
    apps: [
        {
            name: 'shopping-api',
            cwd: './shopping-api',
            script: 'src/index.js',
            watch: false,
            env: { NODE_ENV: 'development', PORT: 4000 },
        },
        {
            name: 'shopping-web',
            cwd: './apps/web',
            script: 'node_modules/vite/bin/vite.js',
            watch: false,
        },
        {
            name: 'shopping-provider',
            cwd: './apps/provider',
            script: 'node_modules/vite/bin/vite.js',
            watch: false,
        },
        {
            name: 'shopping-admin',
            cwd: './apps/admin',
            script: 'node_modules/vite/bin/vite.js',
            watch: false,
        },
    ],
};

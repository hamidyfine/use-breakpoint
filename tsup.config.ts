import { defineConfig } from 'tsup';

export default defineConfig({
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    legacyOutput: true,
    minify: false,
    sourcemap: true,
    target: 'es2018',
    treeshake: true,
    tsconfig: 'tsconfig.build.json',
});


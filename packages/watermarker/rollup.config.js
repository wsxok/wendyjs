import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import packageJson from "./package.json" assert { type: "json" };
import terser from "@rollup/plugin-terser";
import del from 'rollup-plugin-delete'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';


console.log("🌶 rollup current mode: ", process.env.BUILD);

const InjectPlugin = process.env.BUILD === 'production' ?
    [

        nodeResolve({
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            mainFields: ['browser', 'module', 'main'],
        }),
        typescript(),
        getBabelOutputPlugin({
            presets: ['@babel/preset-env'],
            allowAllFormats: true,
        }),
        terser(),
        del({ targets: 'dist/*', verbose: true })
    ] :
    [
        nodeResolve({
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            mainFields: ['browser', 'module', 'main'],
        }),
        typescript()
    ]

export default defineConfig({
    input: "src/index.ts",
    plugins: [
        ...InjectPlugin
    ],
    external: ["node:url", "node:path"],
    output: [
        // commonjs
        {
            file: packageJson.main,
            format: "commonjs",
        },
        // es module
        {
            file: packageJson.module,
            format: "esm",
            treeshake:'smallest'
        },
        {
            file: 'dist/wendyjs-watermark.umd.js',
            format: "umd",
            name:'Watermark'
        },
    ],
});

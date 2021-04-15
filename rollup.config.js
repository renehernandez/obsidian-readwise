import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";
import copy from "rollup-plugin-copy";

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    exports: 'default',
    sourcemap: process.env.BUILD === "development" ? "inline" : false
  },
  external: ['obsidian'],
  plugins: [
    typescript({ sourceMap: process.env.BUILD === "development" }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs({
      include: "node_modules/**"
    }),
    svelte({
      preprocess: autoPreprocess(),
    }),
    copy({
      targets: [
        {
          src: "manifest.json",
          dest: "dist/",
        },
      ],
    }),
  ]
};
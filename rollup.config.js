import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";
import copy from "rollup-plugin-copy";

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/main.js',
    sourcemap: 'inline',
    format: 'cjs',
    exports: 'default'
  },
  external: ['obsidian'],
  plugins: [
    json(),
    typescript(),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
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
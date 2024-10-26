import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/src/bundle.js",
      format: "iife",
      name: "app",
    },
    plugins: [
      resolve({
        dedupe: ["svelte"],
      }),
      commonjs(),
      svelte({
        compilerOptions: {
          customElement: true,
        },
      }),
    ],
  },
  {
    input: "dist/src/bundle.js",
    output: {
      file: "dist/src/bundle.min.js",
      format: "iife",
      name: "app",
    },
    plugins: [terser()],
  },
];

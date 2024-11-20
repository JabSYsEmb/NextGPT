// import typescript from "@rollup/plugin-typescript";
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/src/bundle.js",
      format: "iife",
      name: "app",
    },
    plugins: [
      // typescript(),
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

  {
    input: "static/service-worker/bg.js",
    output: {
      file: "dist/service-worker/bg.js",
      format: "iife",
    },
    plugins: [resolve(), terser()],
  },

  {
    input: {
      "proxy/inject": "static/scripts/proxy/inject.js",
      "proxy/proxy": "static/scripts/proxy/proxy.js",

      "auth/inject": "static/scripts/auth/inject.js",
      "auth/auth": "static/scripts/auth/auth.js",
    },
    output: [
      {
        dir: "dist/src",
        entryFileNames: "[name].js",
        format: "cjs",
      },
    ],
    plugins: [resolve(), terser()],
  },
];

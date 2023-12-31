import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

import packageJson from "./package.json" assert { type: 'json' };

export default {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    json(),
    peerDepsExternal(),
    resolve(),
    typescript({ sourceMap: true }),
    commonjs({
      transformMixedEsModules: true,
    }),
    terser(),
  ]
};

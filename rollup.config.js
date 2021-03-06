import { terser } from 'rollup-plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import typescript from 'typescript';

module.exports = {
  input: 'src/index.ts',
  output: [{ name: 'classy', file: pkg.module, format: 'es' }],
  plugins: [
    del({ targets: [`dist/`] }),
    ts({ typescript, tsconfig: './tsconfig.json' }),
    resolve(), // so Rollup can find `ms`
    commonjs(), // so Rollup can convert `ms` to an ES module
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
    terser(),
    analyze({
      hideDeps: true,
      summaryOnly: true,
      filter: module => /^\/src/.test(module.id),
    }),
  ],
};

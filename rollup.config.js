import { terser } from 'rollup-plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import babel from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import typescript from 'typescript';

module.exports = {
	input: 'src/index.ts',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			exports: 'named',
			sourcemap: true,
		},
		{
			file: pkg.module,
			format: 'esm',
			exports: 'named',
			sourcemap: true,
		},
	],
	plugins: [
		del( { targets: [ `dist/` ] } ),
		peerDepsExternal(),
		ts( { typescript, tsconfig: './tsconfig.json', sourceMap: true } ),
		babel( {
			exclude: 'node_modules/**', // only transpile our source code
			babelHelpers: 'bundled',
		} ),
		resolve( {
			// Source: https://rollupjs.org/guide/en/#peer-dependencies
			moduleDirectory: [ 'node_modules' ],
		} ), // so Rollup can find `ms`
		terser(),
		analyze( {
			hideDeps: true,
			summaryOnly: true,
			filter: ( module ) => /^\/src/.test( module.id ),
		} ),
	],
};

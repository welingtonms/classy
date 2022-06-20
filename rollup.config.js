import { terser } from 'rollup-plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import babel from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import typescript from 'typescript';

module.exports = {
	input: 'src/index.ts',
	output: [
		{
			dir: 'dist',
			format: 'esm',
			sourcemap: true,
		},
	],
	plugins: [
		peerDepsExternal(),
		del( { targets: [ `dist/` ] } ),
		ts( { typescript, tsconfig: './tsconfig.json', sourceMap: false } ),
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

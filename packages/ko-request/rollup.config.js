import path from 'path';
import json from '@rollup/plugin-json'
import babel from 'rollup-plugin-babel'; //便于他们可以使用未被浏览器和 Node.js 支持的将来版本的 JavaScript 特性。
import commonjs from '@rollup/plugin-commonjs'; //用来将 CommonJS 转换成 ES2015 模块的。
import replace from '@rollup/plugin-replace'; //
import resolve from 'rollup-plugin-node-resolve'; //告诉 Rollup 如何查找外部模块


export default {
	input: path.join(__dirname, 'src/index.js'),
	output: {
		name: 'util', //当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
		file: 'lib/ko-request.js',
		format: 'cjs' //  五种输出格式：amd /  es6 / iife / umd / cjs
	},
	plugins: [
		commonjs(),
		resolve(),
		json(),
		babel({
			exclude: 'node_modules/**' ,// 只编译我们的源代码
		}),
		replace({
			exclude: 'node_modules/**'
		}),
	],
	external: ['lodash'] // 指出应将哪些模块视为外部模块

}

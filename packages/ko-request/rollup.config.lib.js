import path from 'path';
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'; //便于他们可以使用未被浏览器和 Node.js 支持的将来版本的 JavaScript 特性。
import commonjs from '@rollup/plugin-commonjs'; //用来将 CommonJS 转换成 ES2015 模块的。
import replace from '@rollup/plugin-replace'; //
import resolve from '@rollup/plugin-node-resolve'; //告诉 Rollup 如何查找外部模块
import ts from 'rollup-plugin-typescript2'; 

const input = ['axios', 'fetch']
const output = input.map(item => {
	return {
		file: `lib/${item}/index.js`,
		format: 'es'
	}
})

const getTsPulgin = input => {
	return ts({
		tsconfig: path.resolve(__dirname, 'tsconfig.json'), // 导入本地ts配置
		tsconfigOverride: {
			include: [`./src/${input}`]
		}
	})
}


function creatConfig(input, output) {
	return {
		input: path.join(__dirname, `src/${input}/index.ts`),
		output,
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
			getTsPulgin(input)
		],
		 // 指出应将哪些模块视为外部模块
		external: ['whatwg-fetch', 'axios', 'qs']
	}
}
export default output.map((item, index) => creatConfig(input[index], item))
// Rollup plugins
import path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
// import cpy from 'rollup-plugin-cpy';
import {terser} from "rollup-plugin-terser";
import ts from 'rollup-plugin-typescript2'; 

export default {
  input: path.join(__dirname,'src/index.ts'),
  output: {
    name:'util',  //当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
    file: path.join(__dirname,process.env.NODE_ENV === 'production' ? 'lib/index.min.js':'lib/index.js'),
    format: 'es' //  五种输出格式：amd /  es6 / iife / umd / cjs
  },
  plugins: [
    json(),
    resolve({
      browser: true,
    }),
    terser(),
    commonjs(),
    babel({
      exclude: 'node_modules/**' ,// 只编译我们的源代码
    }),
    replace({
      exclude: 'node_modules/**'
    }),
    // cpy([
    //   { files: './src', dest: './es' },
    // ]),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'), // 导入本地ts配置
    })
  ]
}
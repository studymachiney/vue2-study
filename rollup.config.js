import babel from 'rollup-plugin-babel'
import  resolve  from '@rollup/plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'
export default {
    input: './src/index.js', // 入口
    output: {
        file: './dist/vue.js', //出口
        name: 'Vue',
        format: 'umd', // esm es6模块  commonjs模块 iife自执行函数 umd(commonjs amd)
        sourcemap: true // 调试源代码
    },
    plugins: [
        babel({
            exclude: 'node_modules/**' // 排除node_modules下的所有文件
        }),
        cleanup(),
        resolve()
    ]
}

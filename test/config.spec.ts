/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2022-03-21 16:39:37
 *****************************************
 */
'use strict';


/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2022-03-17 10:52:15
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { resolve } from 'path';
import { Volume } from 'memfs';
import { Configuration, webpack } from 'webpack';
import { StyleConfigWebpackPlugin } from '../src';


/**
 *****************************************
 * 添加兼容钩子
 *****************************************
 */
global.setImmediate = setTimeout as unknown as typeof setImmediate;


/**
 *****************************************
 * 定义文件系统
 *****************************************
 */
const options: Configuration = {
    context: resolve('fixtures'),
    mode: 'production',
    entry: './index.js',
    target: 'node',
    output: {
        path: '/dist',
        filename: 'index.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ],
            },
        ],
    },
    resolveLoader: {
        extensions: ['.ts', '.js'],
    },
};



/**
 *****************************************
 * 测试模块
 *****************************************
 */
describe('style.config', () => {

    /* 默认配置 */
    test('默认配置', (done) => {
        const compiler = webpack(options);

        // 更新输出文件系统
        const fs = compiler.outputFileSystem = new Volume();

        // 执行编译
        compiler.run((err, stats) => {

            // 执行失败
            if (err) {
                return console.error(err);
            }

            // 编译报告
            if (stats && stats.hasErrors()) {
                return console.error(stats.toString());
            }

            // 获取结果
            const result = fs.readFileSync('/dist/index.js', 'utf8');

            // console.log(result);

            // 校验内容
            expect(fs.readdirSync('/dist')).toEqual(['index.js']);
            expect(result.indexOf('"fontWeight":500,"--font-weight-dark":600') > -1).toBe(true);
            expect(result.indexOf('background: var(--background-color, #fff);') > -1).toBe(true);
            expect(result.indexOf('.scss{font-size:14px}') > -1).toBe(true);
            expect(result.indexOf('.less {\\n  color: #000;\\n}') > -1).toBe(true);
            expect(result.indexOf('--primary-color-outline: rgba(24, 144, 255, .2)') > -1).toBe(false);
            expect(result.indexOf('-webkit-text-size-adjust: none;') > -1).toBe(false);
            expect(result.indexOf('.hide {\\n    display: hide;\\n}') > -1).toBe(false);

            // 编译结束
            done();
        });
    });

    /* 置入样式配置 */
    test('置入样式配置', (done) => {
        const compiler = webpack({
            ...options,
            plugins: [
                new StyleConfigWebpackPlugin({
                    config: resolve('fixtures/style.config'),
                    sass: true,
                    less: true,
                })
            ]
        });

        // 更新输出文件系统
        const fs = compiler.outputFileSystem = new Volume();

        // 执行编译
        compiler.run((err, stats) => {

            // 执行失败
            if (err) {
                return console.error(err);
            }

            // 编译报告
            if (stats && stats.hasErrors()) {
                return console.error(stats.toString());
            }

            // 获取结果
            const result = fs.readFileSync('/dist/index.js', 'utf8');

            // console.log(result);

            // 校验内容
            expect(fs.readdirSync('/dist')).toEqual(['index.js']);
            expect(result.indexOf('fontWeight:500,fontWeightDark:600') > -1).toBe(true);
            expect(result.indexOf('background: var(--background-color, #fff);') > -1).toBe(true);
            expect(result.indexOf('.scss{font-size:16px}') > -1).toBe(true);
            expect(result.indexOf('.less {\\n  color: #1890ff;\\n}') > -1).toBe(true);
            expect(result.indexOf('--primary-color-outline: rgba(24, 144, 255, .2)') > -1).toBe(true);
            expect(result.indexOf('-webkit-text-size-adjust: none;') > -1).toBe(true);
            expect(result.indexOf('.hide {\\n    display: hide;\\n}') > -1).toBe(true);

            // 编译结束
            done();
        });
    });
});

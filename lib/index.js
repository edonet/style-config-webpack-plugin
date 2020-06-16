/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-10 17:56:46
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const path = require('path');
const fs = require('@ainc/fs');
const { Script } = require('@ainc/script');
const MemoryWebpackPlugin = require('memory-webpack-plugin');
const config = require('./style.config');
const utils = require('./utils');
const merge = require('./merge');
const resolve = require('./resolve');


/**
 *****************************************
 * 样式配置加载插件
 *****************************************
 */
class StyleConfigWebpackPlugin extends MemoryWebpackPlugin {

    /* 初始化对象 */
    constructor({ name, style, styles } = {}) {
        super();

        // 定义描述
        this.descriptor = { name: 'style-config-webpack-plugin' };

        // 输出名称
        this.name = name || 'style.config';

        // 配置对象
        this.config = { ...config };

        // 样式配置
        this.cached = {};
        this.data = {};

        // 依赖列表
        this.deps = [style, styles, 'style.config'];
    }

    /* 【SASS】配置 */
    get sass() {
        if (this.cached.sass !== undefined) {
            return this.cached.sass;
        } else {
            return this.cached.sass = utils.sassify(this.data);
        }
    }

    /* 【LESS】配置 */
    get less() {
        if (this.cached.less !== undefined) {
            return this.cached.less;
        } else {
            return this.cached.less = utils.lessify(this.data);
        }
    }

    /* 启动插件 */
    ready({ options }) {
        let deps = new Set(),
            exts = ['.json', '.js', ''],
            dirs = [options.context, process.cwd()],
            loader = path.resolve(__dirname, 'loader.js');

        // 添加加载器
        options.module.rules.push({
            oneOf: [
                {
                    test: /\.s(c|a)ss$/,
                    loader,
                    options: { type: 'sass', config: this },
                },
                {
                    test: /\.less$/,
                    loader,
                    options: { type: 'less', config: this },
                },
            ],
        });

        // 解析依赖配置
        resolve(this.deps, this.config, style => {

            // 解析文件
            if (path.isAbsolute(style)) {
                return exts.forEach(ext => deps.add(style + ext));
            }

            // 解析配置
            dirs.forEach(dir => {
                exts.forEach(ext => deps.add(path.resolve(dir, style + ext)));
            });
        });

        // 生成缓存资源
        this.set(this.name, loader => {
            let config = { ...this.config };

            // 加载依赖
            deps.forEach(file => {
                if (fs.stat(file)) {
                    let script = new Script();

                    // 合并文件配置
                    merge(config, script.execute(file));

                    // 添加依赖
                    script.files.forEach(file => loader.addDependency(file));
                } else {
                    loader.addDependency(file);
                }
            });

            // 生成结果
            this.cached = {};
            this.data = config;

            // 输出文件
            fs.writeFile(
                fs.cwd(`node_modules/${this.name}/index.d.ts`),
                `declare const config: ${utils.typify(config)};\nexport = config;\n`,
            );

            // 返回代码
            return `module.exports = ${JSON.stringify(config)};\n`;
        });
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = StyleConfigWebpackPlugin;

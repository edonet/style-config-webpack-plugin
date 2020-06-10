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
const merge = require('./merge');


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

        // 依赖列表
        this.deps = [style, styles, 'style.config'];
    }

    /* 启动插件 */
    ready({ options }) {
        let deps = this.deps,
            exts = ['.json', '.js', ''],
            dirs = [options.context, process.cwd()];

        // 生成缓存资源
        this.set(this.name, loader => {
            return `module.exports = ${JSON.stringify(this.generate(loader))};\n`;
        });

        // 初始化依赖
        this.deps = new Set();

        // 解析依赖配置
        this.resolve(deps, style => {

            // 解析文件
            if (path.isAbsolute(style)) {
                return exts.forEach(ext => this.deps.add(style + ext));
            }

            // 解析配置
            dirs.forEach(dir => {
                exts.forEach(ext => this.deps.add(path.resolve(dir, style + ext)));
            });
        });
    }

    /* 解析依赖配置 */
    resolve(deps, callback) {
        for (let style of deps) {
            if (style) {
                switch (typeof style) {
                    case 'string':
                        callback(style);
                        break;
                    case 'object':
                        Array.isArray(style) ?
                        this.resolve(style, callback) :
                        merge(this.config, style);
                        break;
                    case 'function':
                        this.resolve([style(this.config)], callback);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    /* 生成资源 */
    generate(loader) {
        let config = { ...this.config };

        // 加载依赖
        this.deps.forEach(dep => {
            if (fs.stat(dep)) {
                let script = new Script();

                // 合并文件配置
                merge(config, script.execute(dep));

                // 添加依赖
                script.files.forEach(file => loader.addDependency(file));
            } else {
                loader.addDependency(dep);
            }
        });

        // 返回结果
        return config;
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = StyleConfigWebpackPlugin;

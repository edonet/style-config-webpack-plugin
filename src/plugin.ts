/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2022-03-19 18:07:14
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import * as path from 'path';
import { Compiler, EntryPlugin, RuleSetRule } from 'webpack';
import { VirtualAssetsWebpackPlugin } from 'virtual-assets-webpack-plugin';
import { load, read } from './fs';
import * as style from './style';


/**
 *****************************************
 * 加载器
 *****************************************
 */
const loader = path.resolve(__dirname, './loader');


/**
 *****************************************
 * 选项
 *****************************************
 */
export interface Options {
    config?: string;
    sass?: boolean;
    less?: boolean;
    reset?: boolean;
    atomic?: boolean;
    default?: boolean;
    extensions?: string[];
}


/**
 *****************************************
 * 样式配置插件
 *****************************************
 */
export class StyleConfigWebpackPlugin extends VirtualAssetsWebpackPlugin {

    /** 插件描述 */
    protected descriptor = { name: 'style-config-webpack-plugin' };

    /** 配置文件 */
    private paths: string[];

    /** 启用 SASS 配置 */
    private sass?: boolean;

    /** 启用 LESS 配置 */
    private less?: boolean;

    /** 添加重置样式 */
    private reset?: string;

    /** 添加原子类样式 */
    private atomic?: string;

    /** 样式数据 */
    private style: style.StyleConfiguration = {
        default: new Map(),
        light: new Map(),
        dark: new Map(),
    };

    /** 缓存样式配置 */
    private cache = { css: '', sass: '', less: '' };

    /** 初始化插件 */
    public constructor(options: Options = {}) {
        super();

        // 格式化配置
        const config = path.resolve(options.config || 'style.config');
        const exts = options.extensions || ['.ts', '.js', '.json'];

        // 输出名称
        this.paths = [config].concat(exts.map(ext => config + ext));
        this.sass = options.sass;
        this.less = options.less;

        // 设置重置文件路径
        if (options.reset !== false) {
            this.reset = read('../public/reset.css');
        }

        // 设置原子类文件路径
        if (options.atomic !== false) {
            this.atomic = read('../public/atomic.css');
        }

        // 加载模块配置
        if (options.default !== false) {
            style.mergeStyleConfiguration(this.style, require('./config'));
        }
    }

    /** 应用插件 */
    public apply(compiler: Compiler): void {
        super.apply(compiler);

        // 生成样式规则
        this.generateRule(compiler);
        this.generateAssets(compiler);
    }

    /** 生成加载规则 */
    private generateRule(compiler: Compiler): void {
        const rules: RuleSetRule[] = [];

        // 启用 SASS 加载器
        this.sass && rules.push({
            test: /\.s(c|a)ss$/,
            loader,
            options: {
                type: 'sass',
                config: () => this.cache.sass,
            },
        });

        // 启用 LESS 加载器
        this.less && rules.push({
            test: /\.less$/,
            loader,
            options: {
                type: 'less',
                config: () => this.cache.less,
            },
        });

        // 添加加载器
        if (rules.length) {
            compiler.options.module.rules.push({ oneOf: rules });
        }
    }

    /** 生成加载资源 */
    private generateAssets(compiler: Compiler): void {
        const entry = new EntryPlugin(compiler.context, 'style.config.css', {});

        // 添加样式配置插件
        entry.apply(compiler);

        // 添加全局
        this.set('./style.config.js', 'export * from "style.config.js";');

        // 添加样式配置
        this.set('style.config.js', (loaderContext) => {

            // 添加依赖
            this.paths.forEach(path => loaderContext.addDependency(path));

            // 生成代码
            return this.loadStyleConfiguration();
        });

        // 添加样式文件
        this.set('style.config.css', async (loaderContext) => {

            // 加载配置文件
            await new Promise<void>((resolve, reject) => {
                loaderContext.loadModule('style.config.js', (err) => err ? reject(err) : resolve());
            });

            // 添加 CSS 配置
            const code = [this.cache.css];

            // 添加预设样式
            this.reset && code.push(this.reset);
            this.atomic && code.push(this.atomic);

            // 返回代码
            return code.join('\n');
        });

        // console.log(this.provider);
    }

    /** 加载样式配置 */
    private loadStyleConfiguration(): string {
        const config = {
            default: new Map(this.style.default),
            light: new Map(this.style.light),
            dark: new Map(this.style.dark),
        };

        // 加载数据
        style.mergeStyleConfiguration(config, load(this.paths));

        // 生成 SASS 配置
        if (this.sass) {
            this.cache.sass = style.generateSASS(config);
        }

        // 生成 LESS 配置
        if (this.less) {
            this.cache.less = style.generateLESS(config);
        }

        // 生成样式配置
        this.cache.css = style.generateCSS(config);

        // 更新缓存
        return style.generateConfiguration(config);
    }
}

/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2022-03-21 16:28:16
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { LoaderContext } from 'webpack';


/**
 *****************************************
 * 选项
 *****************************************
 */
export interface Options {
    type: string;
    config(): string;
}


/**
 *****************************************
 * 加载器
 *****************************************
 */
export default async function loader(this: LoaderContext<Options>, source: string): Promise<string> {
    const opts = this.getOptions();

    // 加载配置文件
    await new Promise<void>((resolve, reject) => {
        this.loadModule('style.config.js', (err) => err ? reject(err) : resolve());
    });

    // 处理 SASS 文件
    if (opts.type === 'sass') {
        return `${opts.config()}\n${source}`;
    }

    // 处理 LESS 文件
    if (opts.type === 'less') {
        return `${source}\n${opts.config()}`;
    }

    // 返回原内容
    return source;
}

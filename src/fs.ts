/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2022-03-19 18:22:15
 *****************************************
 */
'use strict';

/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import * as fs from 'fs';
import * as path from 'path';


/**
 *****************************************
 * 判断是否为文件
 *****************************************
 */
export function isFile(file: string): string | undefined {
    const stats = fs.statSync(file, { throwIfNoEntry: false });

    // 存在文件
    if (stats && stats.isFile()) {
        return file;
    }
}


/**
 *****************************************
 * 读取文件
 *****************************************
 */
export function read(file: string): string {
    return fs.readFileSync(path.resolve(__dirname, file), 'utf-8');
}


/**
 *****************************************
 * 查找文件
 *****************************************
 */
export function find(files: string[]): string | undefined {
    for (let idx = 0, len = files.length; idx < len; idx ++) {
        const result = isFile(files[idx]);

        // 存在解析
        if (result) {
            return result;
        }
    }
}


/**
 *****************************************
 * 加载文件
 *****************************************
 */
export function load(files: string[]): undefined | Record<string, unknown> {
    const file = find(files);

    // 不存在文件
    if (!file) {
        return;
    }

    // 解析 JSON 文件
    if (file.endsWith('.json')) {
        return require(file);
    }

    // 执行文件
    return require('@ainc/script').execute(file);
}

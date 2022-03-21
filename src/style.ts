/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2022-03-21 12:19:38
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 样式数据
 *****************************************
 */
export interface StyleData {
    id: string;
    key: string;
    value: string | number;
}


/**
 *****************************************
 * 样式配置
 *****************************************
 */
export interface StyleConfiguration {
    default: Map<string, StyleData>;
    light: Map<string, StyleData>;
    dark: Map<string, StyleData>;
}


/**
 *****************************************
 * 分词
 *****************************************
 */
function words(value: string): string[] {
    return value
        .replace(/([^A-Z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .split('-')
        .filter(Boolean);
}


/**
 *****************************************
 * 驼峰命名
 *****************************************
 */
function camelCase(words: string[]): string {
    return words.reduce(
        (curr, next) => `${curr}${next.charAt(0).toUpperCase()}${next.slice(1)}`,
    );
}


/**
 *****************************************
 * 中划线命令
 *****************************************
 */
function kebabCase(words: string[]): string {
    return words.map(value => value.toLowerCase()).join('-');
}


/**
 *****************************************
 * 设置样式内容
 *****************************************
 */
function setStyleConfiguration(name: string, value: string | number, style: Map<string, StyleData>): void {
    if (name) {
        const values = words(name);

        // 过滤无效值
        if (values.length) {
            const id = kebabCase(values);
            const key = camelCase(values);

            // 设置值
            style.set(id, { id, key, value });
        }
    }
}


/**
 *****************************************
 * 设置样式内容
 *****************************************
 */
function addStyleConfiguration(key: string, value: unknown, style: Map<string, StyleData>): void {

    // 数值值
    if (typeof value === 'number') {
        return setStyleConfiguration(key, value, style);
    }

    // 字符串值
    if (typeof value === 'string') {
        return setStyleConfiguration(key, value, style);
    }

    // 过滤非法配置
    if (typeof value !== 'object' || !value) {
        return;
    }

    // 遍历属性
    Object.keys(value).forEach(name => {
        addStyleConfiguration(`${key}-${name}`, value[name as keyof object], style);
    });
}


/**
 *****************************************
 * 更新配置
 *****************************************
 */
function updateStyleConfiguration(style: Map<string, StyleData>, data?: unknown): void {

    // 校验数据
    if (!data || typeof data !== 'object') {
        return;
    }

    // 遍历属性
    Object.keys(data).forEach(key => {
        addStyleConfiguration(key, data[key as keyof object], style);
    });
}


/**
 *****************************************
 * 合并配置
 *****************************************
 */
export function mergeStyleConfiguration(style: StyleConfiguration, data?: Record<string, unknown>): void {

    // 校验数据
    if (!data || typeof data !== 'object') {
        return;
    }

    // 遍历属性
    Object.keys(data).forEach(key => {
        const value = data[key];

        // 合并亮调样式
        if (key === 'light') {
            return updateStyleConfiguration(style.light, value);
        }

        // 合并暗调样式
        if (key === 'dark') {
            return updateStyleConfiguration(style.dark, value);
        }

        // 合并默认样式
        if (key === 'default') {
            return updateStyleConfiguration(style.default, value);
        } else {
            return addStyleConfiguration(key, value, style.default);
        }
    });
}


/**
 *****************************************
 * 生成样式
 *****************************************
 */
export function generateCSS(style: StyleConfiguration): string {
    const light: string[] = [];
    const dark: string[] = [];
    const result: string[] = [];

    // 添加样式
    style.default.forEach(({ id, value }) => light.push(`--${id}: ${value};`));
    style.light.forEach(({ id, value }) => light.push(`--${id}: ${value};`));
    style.dark.forEach(({ id, value }) => dark.push(`--${id}: ${value};`));

    // 添加亮调样式
    if (light.length) {
        result.push(`/** 全局变量 */\n:root { ${light.join(' ')} }\n\n`);
    }

    // 添加暗调样式
    if (light.length) {
        result.push(`/** 暗调变量 */\n@media (prefers-color-scheme: dark) {\n    :root { ${dark.join(' ')} } \n}\n\n`);
    }

    // 生成样式
    return result.join('\n');
}


/**
 *****************************************
 * 生成 SASS 配置
 *****************************************
 */
export function generateSASS(style: StyleConfiguration): string {
    const result: string[] = [];

    // 添加样式
    style.default.forEach(({ key, value }) => result.push(`$${key}: ${value};`));
    style.light.forEach(({ key, value }) => result.push(`$${key}: ${value};`));
    style.dark.forEach(({ key, value }) => result.push(`$${key}Dark: ${value};`));

    // 生成样式
    return result.join('\n');
}


/**
 *****************************************
 * 生成 LESS 配置
 *****************************************
 */
export function generateLESS(style: StyleConfiguration): string {
    const result: string[] = [];

    // 添加样式
    style.default.forEach(({ id, value }) => result.push(`@${id}: ${value};`));
    style.light.forEach(({ id, value }) => result.push(`@${id}: ${value};`));
    style.dark.forEach(({ id, value }) => result.push(`@${id}-dark: ${value};`));

    // 生成样式
    return result.join('\n');
}


/**
 *****************************************
 * 生成配置
 *****************************************
 */
export function generateConfiguration(style: StyleConfiguration): string {
    const result: string[] = [];
    const light: Record<string, string | number> = {};
    const dark: Record<string, string | number> = {};

    // 生成数据
    style.light.forEach(({ key, value }) => light[key] = value);
    style.dark.forEach(({ key, value }) => dark[key] = value);

    // 添加默认配置
    style.default.forEach(
        ({ key, value }) => result.push(`export const ${key} = ${JSON.stringify(value)};`)
    );

    // 添加亮调配置
    if (style.light.size) {
        result.push(`export const light = ${JSON.stringify(light, null, 4)};`);
    }

    // 添加暗调配置
    if (style.dark.size) {
        result.push(`export const dark = ${JSON.stringify(dark, null, 4)};`);
    }

    // 生成代码
    return result.join('\n');
}

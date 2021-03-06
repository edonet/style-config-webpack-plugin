/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-11 18:24:57
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 生成变量
 *****************************************
 */
function varify(name, data, upper) {
    let type = typeof data,
        code = '';

    // 处理数字
    if (type === 'number') {
        return `${name}: ${data}px;\n`;
    }

    // 生成值
    if (type !== 'object') {
        return `${name}: ${data};\n`;
    }

    // 拼接值
    if (Array.isArray(data)) {
        return `${name}: ${data.join(' ')};\n`;
    }

    // 遍历对象
    Object.keys(data).forEach(key => {
        let val = data[key];

        // 生成键值
        key = name + (upper ? key.charAt(0).toUpperCase() + key.slice(1) : key);

        // 获取属性
        code += varify(key, val, true);
    });

    // 返回结果
    return code;
}


/**
 *****************************************
 * 生成【sass】代码
 *****************************************
 */
function sassify(data) {
    return varify('$', data);
}


/**
 *****************************************
 * 生成【less】代码
 *****************************************
 */
function lessify(data) {
    return varify('@', data);
}


/**
 *****************************************
 * 生成类型代码
 *****************************************
 */
function typify(data) {
    let code = ' ',
        type = typeof data;

    // 非对象类型
    if (type !== 'object') {
        return type;
    }

    // 空类型
    if (data === null) {
        return 'null';
    }

    // 处理数组类型
    if (Array.isArray(data)) {
        return `[ ${data.map(typify).join(', ') }]`;
    }

    // 对象类型
    Object.keys(data).forEach(
        key => code += `${key}: ${typify(data[key])}; `
    );

    // 返回代码
    return `{${code}}`;
}



/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { sassify, lessify, typify };

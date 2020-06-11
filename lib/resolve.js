/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-11 18:41:14
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const merge = require('./merge');


/**
 *****************************************
 * 解析资源
 *****************************************
 */
module.exports = function resolve(deps, config, callback) {
    for (let style of deps) {
        if (style) {
            switch (typeof style) {
                case 'string':
                    callback(style);
                    break;
                case 'object':
                    Array.isArray(style) ? resolve(style, config, callback) : merge(config, style);
                    break;
                case 'function':
                    resolve([style(config)], config, callback);
                    break;
                default:
                    break;
            }
        }
    }
};

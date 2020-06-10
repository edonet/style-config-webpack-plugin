/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-10 18:13:17
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 合并属性
 *****************************************
 */
module.exports = function merge(target, origin) {
    if (origin && origin !== target) {
        switch (typeof origin) {
            case 'object':

                // 合并配置
                Object.keys(origin).forEach(
                    key => (key !== 'default') && (target[key] = origin[key])
                );

                // 合并默认配置
                merge(target, origin.default);
                break;
            case 'function':
                merge(target, origin(target));
                break;
            default:
                break;
        }
    }

    return target;
};

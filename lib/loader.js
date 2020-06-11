/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-11 16:22:37
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载器
 *****************************************
 */
function loader(source) {
    return source;
}


/**
 *****************************************
 * 预加载器
 *****************************************
 */
function pitch() {
    return new Promise((resolve, reject) => {
        let { type, config } = this.query;

        // 加载配置
        if (type === 'sass') {
            this.loadModule(config.name, err => {
                err ?
                reject(err) :
                resolve(`${config.sass}\n@import ${JSON.stringify(this.resourcePath)};\n`);
            });
        } else {
            this.loadModule(config.name, err => {
                err ?
                reject(err) :
                resolve(`@import ${JSON.stringify(this.resourcePath)};\n${config.less}\n`);
            });
        }
    });
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = loader;
module.exports.pitch = pitch;

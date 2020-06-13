/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-11 16:22:37
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const path = require('path');


/**
 *****************************************
 * 加载器
 *****************************************
 */
function loader(source) {
    let { type, config } = this.query,
        callback = this.async();

    // 加载配置
    this.loadModule(config.name, err => {
        err ? callback(err) : callback(
            null,
            type === 'sass' ? `${config.sass}\n${source}\n` : `${source}\n${config.sass}\n`,
        );
    });
}


/**
 *****************************************
 * 预加载器
 *****************************************
 */
function pitch() {
    let ext = path.extname(this.resourcePath);

    // 处理【SASS】文件
    if (ext === '.scss' || ext === '.sass') {
        return new Promise((resolve, reject) => {
            let { config } = this.query;

            // 加载配置
            this.loadModule(config.name, err => {
                err ?
                reject(err) :
                resolve(`${config.sass}\n@import ${JSON.stringify(this.resourcePath)};\n`);
            });
        });
    }

    // 处理【LESS】文件
    if (ext === '.less') {
        return new Promise((resolve, reject) => {
            let { config } = this.query;

            // 加载配置
            this.loadModule(config.name, err => {
                err ?
                reject(err) :
                resolve(`@import ${JSON.stringify(this.resourcePath)};\n${config.less}\n`);
            });
        });
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
loader.pitch = pitch;
module.exports = loader;

/**
 *****************************************
 * 配置
 *****************************************
 */
interface Options {
    name: string;
    style: string | string[] | Record<string, string>;
}


/**
 *****************************************
 * 样式配置类
 *****************************************
 */
declare class StyleConfigWebpackPlugin {
    constructor(options?: Partial<Options>);
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export = StyleConfigWebpackPlugin;

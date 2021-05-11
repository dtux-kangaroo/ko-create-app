/**
 * 封装localStorage
 * 增加对JSON对象的转换
 * @return {[type]} [description]
 */
export declare class localDb {
    private storage;
    private keys;
    constructor(storageType?: 'sessionStorage' | 'localStorage');
    /**
     * 按key存贮数据value到localStorage
     * @param {String} key   存贮数据的唯一标识
     * @param {String, Object} value 所要存贮的数据
     */
    set(key: string, value: any): void;
    /**
     * 通过key从localStorage获取数据
     * @param  {String} key  获取数据的可以标识
     * @return {String, Object}  返回空，字符串或者对象
     */
    get(key: string): string;
    /**
     * 删除某一项
     * @param key 键名
     */
    delete(key: string): void;
    /**
     * 清空localStorage
     */
    clear(): void;
    /**
     * key是否存在
     * @param key 键名
     */
    has(key: string): boolean;
}

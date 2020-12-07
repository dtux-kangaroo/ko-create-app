/**
 * 封装localStorage
 * 增加对JSON对象的转换
 * @return {[type]} [description]
 */
export class localDb {
    private storage: Storage;
    private keys = new Set<string>();

    constructor(storageType: 'sessionStorage' | 'localStorage' = 'localStorage') {
        this.storage = window[storageType]
    }

    /**
     * 按key存贮数据value到localStorage
     * @param {String} key   存贮数据的唯一标识
     * @param {String, Object} value 所要存贮的数据
     */
    set(key: string, value: any) {
        value = typeof value === 'object' ? JSON.stringify(value) : value

        if(!this.has(key)) {
            this.keys.add(key)
        }

        this.storage.setItem(key, value)
    }

    /**
     * 通过key从localStorage获取数据
     * @param  {String} key  获取数据的可以标识
     * @return {String, Object}  返回空，字符串或者对象
     */
    get(key: string): string {
        let str = this.storage.getItem(key)

        try {
            return JSON.parse(str)
        }catch(e) {
            return str
        }
    }
    
    /**
     * 删除某一项
     * @param key 键名
     */
    delete(key: string) {
        if(this.has(key)) {
            this.keys.delete(key)
            this.storage.removeItem(key)
        }
    }

    /**
     * 清空localStorage
     */
    clear() {
        this.keys.forEach(item => {
            this.storage.removeItem(item)
        })
        this.keys.clear()
    }

    /**
     * key是否存在
     * @param key 键名
     */
    has(key: string) {
        return this.keys.has(key)
    }
}
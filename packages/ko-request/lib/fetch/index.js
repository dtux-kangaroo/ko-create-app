import 'whatwg-fetch';

var ResponseTypeEnum;
(function (ResponseTypeEnum) {
    ResponseTypeEnum["arrayBuffer"] = "arrayBuffer";
    ResponseTypeEnum["blob"] = "blob";
    ResponseTypeEnum["json"] = "json";
    ResponseTypeEnum["text"] = "text";
    ResponseTypeEnum["formData"] = "formData";
})(ResponseTypeEnum || (ResponseTypeEnum = {}));
class Fetch {
    constructor(props = {}) {
        this.initConfig = props.initConfig || {};
        this.reqIntercept = props.reqIntercept || function (config) {
            return config;
        };
        this.resIntercept = props.resIntercept || function (res, config) {
            return res[config.responseType || 'json']();
        };
        this.resErrorCallback = props.resErrorCallback || function () { };
    }
    request(url, options) {
        // 合并初始化config
        const config = Object.assign({}, this.initConfig, options);
        return fetch((config.baseURL || '') + url, this.reqIntercept(config))
            .then(res => this.resIntercept(res, config))
            .catch(err => {
            this.resErrorCallback(err);
        });
    }
    get(url, params, config = {}) {
        let options = {
            method: 'GET',
            ...config
        };
        let newUrl = params ? this.queryString(url, params) : url;
        return this.request(newUrl, options);
    }
    post(url, data = {}, config = {}) {
        let options = {
            method: 'POST',
            headers: {
                "content-type": "application/json;charset=UTF-8"
            },
            body: {},
            ...config
        };
        options.body = JSON.stringify(data);
        return this.request(url, options);
    }
    delete(url, params, conifg = {}) {
        let options = {
            method: 'DELETE',
            ...conifg
        };
        let newUrl = params ? this.queryString(url, params) : url;
        return this.request(newUrl, options);
    }
    put(url, data = {}, config = {}) {
        let options = {
            method: 'PUT',
            body: {},
            ...config
        };
        options.body = JSON.stringify(data);
        return this.request(url, options);
    }
    postForm(url, data, flag = true, config = {}) {
        let options = {
            method: 'POST',
            body: {},
            ...config
        };
        if (data)
            options.body = flag ? this.buildFormData(data) : new FormData(data);
        return this.request(url, options);
    }
    queryString(url, params) {
        const ps = [];
        if (typeof params === 'object') {
            for (let p in params) {
                if (p) {
                    ps.push(p + '=' + encodeURIComponent(params[p]));
                }
            }
            return url + '?' + ps.join('&');
        }
        else {
            return url.split(':')[0] + params;
        }
    }
    buildFormData(params) {
        if (params) {
            const data = new FormData();
            for (let p in params) {
                if (p) {
                    data.append(p, params[p]);
                }
            }
            return data;
        }
    }
}

export { Fetch };

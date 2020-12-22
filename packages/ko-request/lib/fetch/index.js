import 'whatwg-fetch';

class Fetch {
    constructor(props = {}) {
        this.initConfig = props.initConfig || {};
        this.reqIntercept = props.reqIntercept || function (config) {
            return config;
        };
        this.resIntercept = props.resIntercept || async function (res, config) {
            !res.ok && this.resErrorCallback(res);
            if (config.responseType === 'blob' || config.responseType === 'arrayBuffer') {
                const responseHeaders = res.headers, contentType = responseHeaders.get('content-type'), contentDisposition = responseHeaders.get('content-disposition'), fileName = getFileName(contentDisposition);
                const data = await res[config.responseType]();
                return {
                    data,
                    contentType,
                    fileName
                };
            }
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
function getFileName(str) {
    const strList = str && str.split(';') || [];
    let ret = '';
    strList.forEach(item => {
        if (item.indexOf('filename') >= 0) {
            const itemStr = item.split('=');
            ret = itemStr[1];
        }
    });
    if (!ret) {
        return Math.random().toString(36).slice(2);
    }
    return decodeURIComponent(ret);
}

export { Fetch };

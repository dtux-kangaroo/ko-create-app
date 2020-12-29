(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios'), require('qs'), require('whatwg-fetch')) :
	typeof define === 'function' && define.amd ? define(['exports', 'axios', 'qs', 'whatwg-fetch'], factory) :
	(global = global || self, factory(global['ko-request'] = {}, global._axios, global.qs));
}(this, (function (exports, _axios, qs) { 'use strict';

	_axios = _axios && Object.prototype.hasOwnProperty.call(_axios, 'default') ? _axios['default'] : _axios;
	qs = qs && Object.prototype.hasOwnProperty.call(qs, 'default') ? qs['default'] : qs;

	class Axios {
	    constructor(props = {}) {
	        this.initConfig = props.initConfig || {};
	        // this.beforeRequset = props.beforeRequset || function(){}
	        this.reqIntercept = props.reqIntercept || function (config) { return config; };
	        this.resIntercept = props.resIntercept || function (response) {
	            const config = response.config;
	            switch (response.status) {
	                case 200:
	                    if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
	                        const responseHeaders = response.headers, contentType = responseHeaders['content-type'], contentDisposition = responseHeaders['content-disposition'], fileName = getFileName(contentDisposition);
	                        return {
	                            data: response.data,
	                            contentType,
	                            fileName
	                        };
	                    }
	                    return response.data;
	                case 301:
	                    return;
	                default:
	                    this.resErrorCallback(response);
	                    return Promise.reject(response);
	            }
	        };
	        this.resErrorCallback = props.resErrorCallback || function () { };
	        this.instance = _axios.create(this.initConfig);
	        this.setInterceptors(this.instance);
	    }
	    //设置拦截器
	    setInterceptors(instance, url = '') {
	        // 这里的url可供你针对需要特殊处理的接口路径设置不同拦截器。
	        // this.beforeRequset(url)
	        instance.interceptors.request.use((config) => {
	            return this.reqIntercept(config);
	        }, err => Promise.reject(err));
	        instance.interceptors.response.use((response) => {
	            // 在这里移除loading
	            // todo: 想根据业务需要，对响应结果预先处理的，都放在这里
	            return this.resIntercept(response);
	        }, (err) => {
	            if (err.request) { // 请求超时处理
	                if (err.request.readyState === 4 && err.request.status === 0) {
	                    // 当一个请求在上面的timeout属性中设置的时间内没有完成，则触发超时错误
	                    // todo handler request timeout error
	                    console.error("请求超时!");
	                    err = Object.assign(err, { timeout: true });
	                }
	            }
	            this.resErrorCallback(err);
	            return Promise.reject(err);
	        });
	    }
	    request(url, options) {
	        const config = {
	            url,
	            ...options
	        };
	        // 配置拦截器，支持根据不同url配置不同的拦截器
	        //通过了拦截器才能继续返回data
	        // if(options.setInterceptors) {
	        // 	delete options.setInterceptors
	        // 	const instance = _axios.create();
	        // 	this.setInterceptors(instance, url);
	        // 	return instance(config);
	        // }
	        return this.instance(config); // 返回axios实例的执行结果
	    }
	    get(url, params = {}, config = {}) {
	        let options = {
	            method: 'GET',
	            params,
	            ...config
	        };
	        return this.request(url, options);
	    }
	    post(url, data = {}, config = {}) {
	        let options = {
	            method: 'POST',
	            ...config,
	            data
	        };
	        return this.request(url, options);
	    }
	    delete(url, params = {}, config = {}) {
	        let options = {
	            method: 'DELETE',
	            params,
	            ...config
	        };
	        return this.request(url, options);
	    }
	    put(url, data = {}, config = {}) {
	        let options = {
	            method: 'PUT',
	            data,
	            ...config
	        };
	        return this.request(url, options);
	    }
	    postForm(url, data = {}, config = {}) {
	        let options = {
	            method: 'POST',
	            data: qs.stringify(data),
	            ...config,
	            headers: {
	                'content-type': 'application/x-www-form-urlencoded'
	            }
	        };
	        return this.request(url, options);
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

	class Fetch {
	    constructor(props = {}) {
	        this.initConfig = props.initConfig || {};
	        this.reqIntercept = props.reqIntercept || function (config) {
	            return config;
	        };
	        this.resIntercept = props.resIntercept || async function (res, config) {
	            !res.ok && this.resErrorCallback(res);
	            if (config.responseType === 'blob' || config.responseType === 'arrayBuffer') {
	                const responseHeaders = res.headers, contentType = responseHeaders.get('content-type'), contentDisposition = responseHeaders.get('content-disposition'), fileName = getFileName$1(contentDisposition);
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
	function getFileName$1(str) {
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

	exports.Axios = Axios;
	exports.Fetch = Fetch;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

import 'whatwg-fetch'

interface FetchConfig extends RequestInit {
	baseURL?: string;
	responseType?: ResponseTypeEnum;
}

interface IProps {
	initConfig?: Partial<FetchConfig>;
	reqIntercept?: (config: FetchConfig) => FetchConfig;
	resIntercept?: (response: Response) => Promise<any>;
	resErrorCallback?: (err) => void
}

enum ResponseTypeEnum {
	arrayBuffer = 'arrayBuffer',
	blob = 'blob',
	json = 'json',
	text = 'text',
	formData = 'formData'
}

export class Fetch {
	initConfig: Partial<FetchConfig>;
	reqIntercept: (config: FetchConfig) => FetchConfig;
	resIntercept: (response: Response, config?: FetchConfig) => Promise<any>;
	resErrorCallback: (err) => void;

	constructor(props: IProps = {}) {
		this.initConfig = props.initConfig || {};
		this.reqIntercept = props.reqIntercept || function(config: FetchConfig) {
			return config
		};
		this.resIntercept = props.resIntercept || function(res, config) {
			return res[config.responseType || 'json']()
		}
		this.resErrorCallback = props.resErrorCallback || function () {}
	}

	request(url: string, options: FetchConfig) {
		// 合并初始化config
		const config = Object.assign({}, this.initConfig, options)

		return fetch((config.baseURL || '') + url, this.reqIntercept(config))
			.then(res => this.resIntercept(res, config))
			.catch(err => {
				this.resErrorCallback(err);
			});
	}

	get(url: string, params?: object, config: FetchConfig = {}) {
		let options = {
			method: 'GET',
			...config
		}
		let newUrl = params ? this.queryString(url, params) : url;
		
		return this.request(newUrl, options)
	}

	post(url: string, data = {}, config: FetchConfig = {}) {
		let options = {
			method: 'POST',
			headers: {
				"content-type": "application/json;charset=UTF-8"
			},
			body: {} as BodyInit,
			...config
		}
		options.body = JSON.stringify(data)
		return this.request(url, options)
	}

	delete(url: string, params?: object, conifg: FetchConfig = {}) {
		let options = {
			method: 'DELETE',
			...conifg
		}
		let newUrl = params ? this.queryString(url, params) : url;
		return this.request(newUrl, options)
	}

	put(url: string, data = {}, config: FetchConfig = {}) {
		let options = {
			method: 'PUT',
			body: {} as BodyInit,
			...config
		}
		options.body = JSON.stringify(data)
		return this.request(url, options)
	}

	postForm(url: string, data, flag = true, config: FetchConfig = {}) {
		let options = {
			method: 'POST',
			body: {} as BodyInit,
			...config
		}
		if (data) options.body = flag ? this.buildFormData(data) : new FormData(data);
		return this.request(url, options)
	}

	queryString(url: string, params) {
		const ps = []
		if (typeof params === 'object') {
			for (let p in params) {
				if (p) {
					ps.push(p + '=' + encodeURIComponent(params[p]));
				}
			}
			return url + '?' + ps.join('&')
		} else {
			return url.split(':')[0] + params
		}
	}

	buildFormData(params) {
		if (params) {
			const data = new FormData()
			for (let p in params) {
				if (p) {
					data.append(p, params[p])
				}
			}
			return data;
		}
	}
}

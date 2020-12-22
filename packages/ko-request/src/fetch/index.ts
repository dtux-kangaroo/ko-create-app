import 'whatwg-fetch'

interface FetchConfig extends RequestInit {
	baseURL?: string;
	responseType?: ResponseType;
}

interface IProps {
	initConfig?: Partial<FetchConfig>;
	reqIntercept?: (config: FetchConfig) => FetchConfig;
	resIntercept?: (response: Response, config?: FetchConfig) => Promise<any>;
	resErrorCallback?: (err) => void
}

type ResponseType = 'arrayBuffer' | 'blob' | 'json' | 'text' | 'formData'

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
		this.resIntercept = props.resIntercept || async function(res, config) {
			!res.ok && this.resErrorCallback(res);
			if(config.responseType === 'blob' || config.responseType === 'arrayBuffer') {
				const responseHeaders = res.headers,
					contentType = responseHeaders.get('content-type'),
					contentDisposition = responseHeaders.get('content-disposition'),
  					fileName = getFileName(contentDisposition);
				
				const data = await res[config.responseType]()
				return {
					data,
					contentType,
					fileName
				}
			}

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

	private queryString(url: string, params) {
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

	private buildFormData(params) {
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

function getFileName(str: string): string {
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

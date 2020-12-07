import _axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';

interface IProps {
	initConfig?: AxiosRequestConfig;
	beforeRequset?: (url: string) => void;
	reqIntercept?: (config: AxiosRequestConfig) => AxiosRequestConfig;
	resIntercept?: (response: AxiosResponse) => any;
	resErrorCallback?: (err: AxiosError) => void
}

export class Axios {
	private initConfig: AxiosRequestConfig;
	// private beforeRequset: (url: string) => void;
	private reqIntercept: (config: AxiosRequestConfig) => AxiosRequestConfig;
	private resIntercept: (response: AxiosResponse) => any;
	private instance: AxiosInstance;
	private resErrorCallback: (err: AxiosError) => void;
	
	constructor(props: IProps = {}) {
		this.initConfig = props.initConfig || {};
		// this.beforeRequset = props.beforeRequset || function(){}
		this.reqIntercept = props.reqIntercept || function(config: AxiosRequestConfig) {return config}
		this.resIntercept = props.resIntercept || function(response){ 
			switch (response.status) {
				case 200:
					return response.data;
				case 301:
					return;
				default:
					return Promise.reject('error');
			}
		}
		this.resErrorCallback = props.resErrorCallback || function () {}

		this.instance = _axios.create(this.initConfig);
		this.setInterceptors(this.instance)
	}

	//设置拦截器
	private setInterceptors(instance: AxiosInstance, url = '') {
		// 这里的url可供你针对需要特殊处理的接口路径设置不同拦截器。
		// this.beforeRequset(url)
		instance.interceptors.request.use((config) => { // 请求拦截器
			return this.reqIntercept(config);
		}, err => Promise.reject(err));

		instance.interceptors.response.use((response) => { // 响应拦截器
			// 在这里移除loading
			// todo: 想根据业务需要，对响应结果预先处理的，都放在这里
			return this.resIntercept(response) 
		
		}, (err) => {
			console.log("response err", err)
			if (err.request) { // 请求超时处理
				if (err.request.readyState === 4 && err.request.status === 0) {
					// 当一个请求在上面的timeout属性中设置的时间内没有完成，则触发超时错误
					// todo handler request timeout error
					console.error("请求超时!")
					err = Object.assign(err, {timeout: true})
				}
			}
			this.resErrorCallback(err)
			return Promise.reject(err);
		});
	}

	request(url: string, options: AxiosRequestConfig) {
		const config = { // 将用户传过来的参数与公共配置合并。
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

	get(url: string, params = {}, config: AxiosRequestConfig = {}) {
		let options = {
			method: 'GET',
			params,
			...config
		} as AxiosRequestConfig
		
		return this.request(url, options)
	}

	post(url: string, data = {}, config: AxiosRequestConfig = {}) {
		let options = {
			method: 'POST',
			...config,
			data
		} as AxiosRequestConfig
		
		return this.request(url, options)
	}

	delete(url: string, params = {}, config: AxiosRequestConfig = {}) {
		let options = {
			method: 'DELETE',
			params,
			...config
		} as AxiosRequestConfig
		
		return this.request(url, options)
	}

	put(url: string, data = {}, config: AxiosRequestConfig = {}) {
		let options = {
			method: 'PUT',
			data,
			...config
		} as AxiosRequestConfig
		
		return this.request(url, options)
	}

	postForm(url: string, data = {}, config: AxiosRequestConfig = {}) {
		let options = {
			method: 'POST',
			data: qs.stringify(data),
			...config,
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		} as AxiosRequestConfig
		
		return this.request(url, options)
	}
}

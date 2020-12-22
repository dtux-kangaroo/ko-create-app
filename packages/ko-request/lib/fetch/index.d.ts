import 'whatwg-fetch';
interface FetchConfig extends RequestInit {
    baseURL?: string;
    responseType?: ResponseType;
}
interface IProps {
    initConfig?: Partial<FetchConfig>;
    reqIntercept?: (config: FetchConfig) => FetchConfig;
    resIntercept?: (response: Response, config?: FetchConfig) => Promise<any>;
    resErrorCallback?: (err: any) => void;
}
declare type ResponseType = 'arrayBuffer' | 'blob' | 'json' | 'text' | 'formData';
export declare class Fetch {
    initConfig: Partial<FetchConfig>;
    reqIntercept: (config: FetchConfig) => FetchConfig;
    resIntercept: (response: Response, config?: FetchConfig) => Promise<any>;
    resErrorCallback: (err: any) => void;
    constructor(props?: IProps);
    request(url: string, options: FetchConfig): Promise<any>;
    get(url: string, params?: object, config?: FetchConfig): Promise<any>;
    post(url: string, data?: {}, config?: FetchConfig): Promise<any>;
    delete(url: string, params?: object, conifg?: FetchConfig): Promise<any>;
    put(url: string, data?: {}, config?: FetchConfig): Promise<any>;
    postForm(url: string, data: any, flag?: boolean, config?: FetchConfig): Promise<any>;
    private queryString;
    private buildFormData;
}
export {};

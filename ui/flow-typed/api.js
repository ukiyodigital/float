/* eslint-disable */
import API from "../src/api/API";


declare type APIData = {
    data: Object | Array<any>,
    meta?: any
}

declare type APIError = {
    errors: Array<{title: string, detail: string, meta: any}>,
    meta?: any
}

declare type APIResponse = APIData | APIError

declare interface IBaseAPI {
    csrftoken: ?string;
    apiUrl: ?string;
    requestInit(requestType?: string, body?: any, cors?: boolean): Object;
    fetchData(input: string, init?: Object): Promise<any>;
    downloadFile(location: string, requestType?: string, body?: Object): void;
    getUri(location: string, version?: string): string;
}

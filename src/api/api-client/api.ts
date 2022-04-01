/* tslint:disable */
/* eslint-disable */
/**
 * DigiWF API
 * DigiWF - Plattform zur Digitalisierung von Workflows bei der LHM
 *
 * The version of the OpenAPI document: 0.34.0-SNAPSHOT
 * Contact: itm.digiwf@muenchen.de
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';


/**
 * HumanTaskFileRestControllerApi - axios parameter creator
 * @export
 */
export const HumanTaskFileRestControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getFileNames: async (taskId: string, fieldKey: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'taskId' is not null or undefined
            assertParamExists('getFileNames', 'taskId', taskId)
            // verify required parameter 'fieldKey' is not null or undefined
            assertParamExists('getFileNames', 'fieldKey', fieldKey)
            const localVarPath = `/rest/task/file/{taskId}/{fieldKey}`
                .replace(`{${"taskId"}}`, encodeURIComponent(String(taskId)))
                .replace(`{${"fieldKey"}}`, encodeURIComponent(String(fieldKey)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication spring_oauth required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "spring_oauth", [], configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileDeletion: async (taskId: string, fieldKey: string, filename: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'taskId' is not null or undefined
            assertParamExists('getPresignedUrlForFileDeletion', 'taskId', taskId)
            // verify required parameter 'fieldKey' is not null or undefined
            assertParamExists('getPresignedUrlForFileDeletion', 'fieldKey', fieldKey)
            // verify required parameter 'filename' is not null or undefined
            assertParamExists('getPresignedUrlForFileDeletion', 'filename', filename)
            const localVarPath = `/rest/task/file/{taskId}/{fieldKey}/{filename}`
                .replace(`{${"taskId"}}`, encodeURIComponent(String(taskId)))
                .replace(`{${"fieldKey"}}`, encodeURIComponent(String(fieldKey)))
                .replace(`{${"filename"}}`, encodeURIComponent(String(filename)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication spring_oauth required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "spring_oauth", [], configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {string} fileName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileDownload: async (taskId: string, fieldKey: string, fileName: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'taskId' is not null or undefined
            assertParamExists('getPresignedUrlForFileDownload', 'taskId', taskId)
            // verify required parameter 'fieldKey' is not null or undefined
            assertParamExists('getPresignedUrlForFileDownload', 'fieldKey', fieldKey)
            // verify required parameter 'fileName' is not null or undefined
            assertParamExists('getPresignedUrlForFileDownload', 'fileName', fileName)
            const localVarPath = `/rest/task/file/{taskId}/{fieldKey}/{fileName}`
                .replace(`{${"taskId"}}`, encodeURIComponent(String(taskId)))
                .replace(`{${"fieldKey"}}`, encodeURIComponent(String(fieldKey)))
                .replace(`{${"fileName"}}`, encodeURIComponent(String(fileName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication spring_oauth required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "spring_oauth", [], configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileUpload: async (taskId: string, fieldKey: string, filename: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'taskId' is not null or undefined
            assertParamExists('getPresignedUrlForFileUpload', 'taskId', taskId)
            // verify required parameter 'fieldKey' is not null or undefined
            assertParamExists('getPresignedUrlForFileUpload', 'fieldKey', fieldKey)
            // verify required parameter 'filename' is not null or undefined
            assertParamExists('getPresignedUrlForFileUpload', 'filename', filename)
            const localVarPath = `/rest/task/file/{taskId}/{fieldKey}/{filename}`
                .replace(`{${"taskId"}}`, encodeURIComponent(String(taskId)))
                .replace(`{${"fieldKey"}}`, encodeURIComponent(String(fieldKey)))
                .replace(`{${"filename"}}`, encodeURIComponent(String(filename)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication spring_oauth required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "spring_oauth", [], configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * HumanTaskFileRestControllerApi - functional programming interface
 * @export
 */
export const HumanTaskFileRestControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = HumanTaskFileRestControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getFileNames(taskId: string, fieldKey: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getFileNames(taskId, fieldKey, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPresignedUrlForFileDeletion(taskId: string, fieldKey: string, filename: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPresignedUrlForFileDeletion(taskId, fieldKey, filename, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {string} fileName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPresignedUrlForFileDownload(taskId: string, fieldKey: string, fileName: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPresignedUrlForFileDownload(taskId, fieldKey, fileName, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPresignedUrlForFileUpload(taskId: string, fieldKey: string, filename: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPresignedUrlForFileUpload(taskId, fieldKey, filename, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * HumanTaskFileRestControllerApi - factory interface
 * @export
 */
export const HumanTaskFileRestControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = HumanTaskFileRestControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getFileNames(taskId: string, fieldKey: string, options?: any): AxiosPromise<Array<string>> {
            return localVarFp.getFileNames(taskId, fieldKey, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileDeletion(taskId: string, fieldKey: string, filename: string, options?: any): AxiosPromise<string> {
            return localVarFp.getPresignedUrlForFileDeletion(taskId, fieldKey, filename, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {string} fileName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileDownload(taskId: string, fieldKey: string, fileName: string, options?: any): AxiosPromise<string> {
            return localVarFp.getPresignedUrlForFileDownload(taskId, fieldKey, fileName, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} taskId 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileUpload(taskId: string, fieldKey: string, filename: string, options?: any): AxiosPromise<string> {
            return localVarFp.getPresignedUrlForFileUpload(taskId, fieldKey, filename, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * HumanTaskFileRestControllerApi - object-oriented interface
 * @export
 * @class HumanTaskFileRestControllerApi
 * @extends {BaseAPI}
 */
export class HumanTaskFileRestControllerApi extends BaseAPI {
    /**
     * 
     * @param {string} taskId 
     * @param {string} fieldKey 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof HumanTaskFileRestControllerApi
     */
    public getFileNames(taskId: string, fieldKey: string, options?: any) {
        return HumanTaskFileRestControllerApiFp(this.configuration).getFileNames(taskId, fieldKey, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} taskId 
     * @param {string} fieldKey 
     * @param {string} filename 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof HumanTaskFileRestControllerApi
     */
    public getPresignedUrlForFileDeletion(taskId: string, fieldKey: string, filename: string, options?: any) {
        return HumanTaskFileRestControllerApiFp(this.configuration).getPresignedUrlForFileDeletion(taskId, fieldKey, filename, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} taskId 
     * @param {string} fieldKey 
     * @param {string} fileName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof HumanTaskFileRestControllerApi
     */
    public getPresignedUrlForFileDownload(taskId: string, fieldKey: string, fileName: string, options?: any) {
        return HumanTaskFileRestControllerApiFp(this.configuration).getPresignedUrlForFileDownload(taskId, fieldKey, fileName, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} taskId 
     * @param {string} fieldKey 
     * @param {string} filename 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof HumanTaskFileRestControllerApi
     */
    public getPresignedUrlForFileUpload(taskId: string, fieldKey: string, filename: string, options?: any) {
        return HumanTaskFileRestControllerApiFp(this.configuration).getPresignedUrlForFileUpload(taskId, fieldKey, filename, options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * ServiceStartFileRestControllerApi - axios parameter creator
 * @export
 */
export const ServiceStartFileRestControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getFileNames1: async (definitionKey: string, fieldKey: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'definitionKey' is not null or undefined
            assertParamExists('getFileNames1', 'definitionKey', definitionKey)
            // verify required parameter 'fieldKey' is not null or undefined
            assertParamExists('getFileNames1', 'fieldKey', fieldKey)
            const localVarPath = `/rest/service/start/file/{definitionKey}/{fieldKey}`
                .replace(`{${"definitionKey"}}`, encodeURIComponent(String(definitionKey)))
                .replace(`{${"fieldKey"}}`, encodeURIComponent(String(fieldKey)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication spring_oauth required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "spring_oauth", [], configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileDeletion1: async (definitionKey: string, fieldKey: string, filename: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'definitionKey' is not null or undefined
            assertParamExists('getPresignedUrlForFileDeletion1', 'definitionKey', definitionKey)
            // verify required parameter 'fieldKey' is not null or undefined
            assertParamExists('getPresignedUrlForFileDeletion1', 'fieldKey', fieldKey)
            // verify required parameter 'filename' is not null or undefined
            assertParamExists('getPresignedUrlForFileDeletion1', 'filename', filename)
            const localVarPath = `/rest/service/start/file/{definitionKey}/{fieldKey}/{filename}`
                .replace(`{${"definitionKey"}}`, encodeURIComponent(String(definitionKey)))
                .replace(`{${"fieldKey"}}`, encodeURIComponent(String(fieldKey)))
                .replace(`{${"filename"}}`, encodeURIComponent(String(filename)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication spring_oauth required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "spring_oauth", [], configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {string} fileName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileDownload1: async (definitionKey: string, fieldKey: string, fileName: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'definitionKey' is not null or undefined
            assertParamExists('getPresignedUrlForFileDownload1', 'definitionKey', definitionKey)
            // verify required parameter 'fieldKey' is not null or undefined
            assertParamExists('getPresignedUrlForFileDownload1', 'fieldKey', fieldKey)
            // verify required parameter 'fileName' is not null or undefined
            assertParamExists('getPresignedUrlForFileDownload1', 'fileName', fileName)
            const localVarPath = `/rest/service/start/file/{definitionKey}/{fieldKey}/{fileName}`
                .replace(`{${"definitionKey"}}`, encodeURIComponent(String(definitionKey)))
                .replace(`{${"fieldKey"}}`, encodeURIComponent(String(fieldKey)))
                .replace(`{${"fileName"}}`, encodeURIComponent(String(fileName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication spring_oauth required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "spring_oauth", [], configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileUpload1: async (definitionKey: string, fieldKey: string, filename: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'definitionKey' is not null or undefined
            assertParamExists('getPresignedUrlForFileUpload1', 'definitionKey', definitionKey)
            // verify required parameter 'fieldKey' is not null or undefined
            assertParamExists('getPresignedUrlForFileUpload1', 'fieldKey', fieldKey)
            // verify required parameter 'filename' is not null or undefined
            assertParamExists('getPresignedUrlForFileUpload1', 'filename', filename)
            const localVarPath = `/rest/service/start/file/{definitionKey}/{fieldKey}/{filename}`
                .replace(`{${"definitionKey"}}`, encodeURIComponent(String(definitionKey)))
                .replace(`{${"fieldKey"}}`, encodeURIComponent(String(fieldKey)))
                .replace(`{${"filename"}}`, encodeURIComponent(String(filename)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication spring_oauth required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "spring_oauth", [], configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ServiceStartFileRestControllerApi - functional programming interface
 * @export
 */
export const ServiceStartFileRestControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ServiceStartFileRestControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getFileNames1(definitionKey: string, fieldKey: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getFileNames1(definitionKey, fieldKey, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPresignedUrlForFileDeletion1(definitionKey: string, fieldKey: string, filename: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPresignedUrlForFileDeletion1(definitionKey, fieldKey, filename, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {string} fileName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPresignedUrlForFileDownload1(definitionKey: string, fieldKey: string, fileName: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPresignedUrlForFileDownload1(definitionKey, fieldKey, fileName, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPresignedUrlForFileUpload1(definitionKey: string, fieldKey: string, filename: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPresignedUrlForFileUpload1(definitionKey, fieldKey, filename, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * ServiceStartFileRestControllerApi - factory interface
 * @export
 */
export const ServiceStartFileRestControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ServiceStartFileRestControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getFileNames1(definitionKey: string, fieldKey: string, options?: any): AxiosPromise<Array<string>> {
            return localVarFp.getFileNames1(definitionKey, fieldKey, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileDeletion1(definitionKey: string, fieldKey: string, filename: string, options?: any): AxiosPromise<string> {
            return localVarFp.getPresignedUrlForFileDeletion1(definitionKey, fieldKey, filename, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {string} fileName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileDownload1(definitionKey: string, fieldKey: string, fileName: string, options?: any): AxiosPromise<string> {
            return localVarFp.getPresignedUrlForFileDownload1(definitionKey, fieldKey, fileName, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} definitionKey 
         * @param {string} fieldKey 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPresignedUrlForFileUpload1(definitionKey: string, fieldKey: string, filename: string, options?: any): AxiosPromise<string> {
            return localVarFp.getPresignedUrlForFileUpload1(definitionKey, fieldKey, filename, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ServiceStartFileRestControllerApi - object-oriented interface
 * @export
 * @class ServiceStartFileRestControllerApi
 * @extends {BaseAPI}
 */
export class ServiceStartFileRestControllerApi extends BaseAPI {
    /**
     * 
     * @param {string} definitionKey 
     * @param {string} fieldKey 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ServiceStartFileRestControllerApi
     */
    public getFileNames1(definitionKey: string, fieldKey: string, options?: any) {
        return ServiceStartFileRestControllerApiFp(this.configuration).getFileNames1(definitionKey, fieldKey, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} definitionKey 
     * @param {string} fieldKey 
     * @param {string} filename 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ServiceStartFileRestControllerApi
     */
    public getPresignedUrlForFileDeletion1(definitionKey: string, fieldKey: string, filename: string, options?: any) {
        return ServiceStartFileRestControllerApiFp(this.configuration).getPresignedUrlForFileDeletion1(definitionKey, fieldKey, filename, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} definitionKey 
     * @param {string} fieldKey 
     * @param {string} fileName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ServiceStartFileRestControllerApi
     */
    public getPresignedUrlForFileDownload1(definitionKey: string, fieldKey: string, fileName: string, options?: any) {
        return ServiceStartFileRestControllerApiFp(this.configuration).getPresignedUrlForFileDownload1(definitionKey, fieldKey, fileName, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} definitionKey 
     * @param {string} fieldKey 
     * @param {string} filename 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ServiceStartFileRestControllerApi
     */
    public getPresignedUrlForFileUpload1(definitionKey: string, fieldKey: string, filename: string, options?: any) {
        return ServiceStartFileRestControllerApiFp(this.configuration).getPresignedUrlForFileUpload1(definitionKey, fieldKey, filename, options).then((request) => request(this.axios, this.basePath));
    }
}



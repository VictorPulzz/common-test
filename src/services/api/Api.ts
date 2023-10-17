import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import merge from 'lodash.merge';
import snakecaseKeys from 'snakecase-keys';

import { makeQueryString } from '~/utils';
import { makeFormData, mapFormData } from '~/utils/formData';
import { isPlainObject } from '~/utils/object';
import { camelToSnakeCase } from '~/utils/string';

import { CONTENT_TYPE_HEADER, ContentType } from './constants';
import { ApiParams } from './types';
import { hasUnauthorizedError, retryWithNewTokens, setAuthorizationHeader } from './utils';

/**
 * Reusable API service
 *
 * You should initialize it before using. Most common way to do it is this:
 *
 * ~~~
 * import { Api } from '@appello/common/lib/services/api';
 *
 * import { API_URL, REFRESH_TOKEN_URL } from '~/constants/env';
 * import { logout, updateTokens } from '~/modules/user/slice';
 * import { store } from '~/store';
 *
 * Api.initialize({
 *   apiUrl: API_URL,
 *   refreshTokenUrl: REFRESH_TOKEN_URL,
 *   getToken: () => store.getState().user.auth?.access, // getting current auth token from the store
 *   getRefreshToken: () => store.getState().user.auth?.refresh, // getting current refresh token from the store
 *   onTokenRefreshSuccess: data => store.dispatch(updateTokens(data)), // update tokens with new values
 *   onTokenRefreshError: () => store.dispatch(logout()), // log out the user or some other kind of error processing
 * });
 * ~~~
 *
 */

export class Api {
  static instance: Api;

  axiosInstance: AxiosInstance;

  constructor({ shouldTransformKeys = false, timeout = 30000, ...params }: ApiParams) {
    this.axiosInstance = axios.create({
      timeout,
      baseURL: params.apiUrl,
      headers: {
        Accept: ContentType.JSON,
        [CONTENT_TYPE_HEADER]: ContentType.JSON,
        ...(params?.customHeaders?.() || {}),
      },
      paramsSerializer(params) {
        return makeQueryString(
          shouldTransformKeys ? snakecaseKeys(params, { deep: true }) : params,
          { withPrefix: false },
        );
      },
      transformRequest(body: unknown, headers = {}) {
        if (headers[CONTENT_TYPE_HEADER] === ContentType.FORM_DATA) {
          const formData = body instanceof FormData ? body : makeFormData(body);

          if (shouldTransformKeys) {
            return mapFormData(formData, ([key, value]) => [camelToSnakeCase(key), value]);
          }

          return formData;
        }

        if (isPlainObject(body)) {
          return JSON.stringify(shouldTransformKeys ? snakecaseKeys(body, { deep: true }) : body);
        }

        return body;
      },
      transformResponse(rawResponse) {
        if (!rawResponse) {
          return undefined;
        }

        const response = JSON.parse(rawResponse);

        if (shouldTransformKeys) {
          return camelcaseKeys(response, { deep: true });
        }

        return response;
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = params.getToken();
        if (token) {
          config.headers = setAuthorizationHeader(token, config.headers);
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error?.config?.params?.noCheckUnauthorizedError) {
          return Promise.reject(error);
        }

        if (hasUnauthorizedError(error, params)) {
          return retryWithNewTokens(this.axiosInstance, error, params);
        }

        return Promise.reject(error);
      },
    );
  }

  static initialize(params: ApiParams): Api {
    Api.instance = new Api(params);

    return Api.instance;
  }

  static getInstance(): Api {
    if (!Api.instance) {
      // eslint-disable-next-line no-console
      console.error('Initialize Api Service before using it!');
      throw new Error('Initialize Api Service before using it!');
    }
    return Api.instance;
  }

  static getAxios(): AxiosInstance {
    return Api.getInstance().axiosInstance;
  }

  static setBaseUrl(url: string): void {
    Api.getAxios().defaults.baseURL = url;
  }

  static setAxiosConfig(config: AxiosRequestConfig): void {
    Api.getAxios().defaults = merge(Api.getAxios().defaults, config);
  }

  static get<T = any>(
    url: string,
    params: Record<string, any> = {},
    config: AxiosRequestConfig = {},
  ): AxiosPromise<T> {
    return Api.getAxios().get(url, { params, ...config });
  }

  static delete<T = any>(
    url: string,
    params: Record<string, any> = {},
    config: AxiosRequestConfig = {},
  ): AxiosPromise<T> {
    return Api.getAxios().delete(url, { params, ...config });
  }

  static post<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    return Api.getAxios().post(url, data, config);
  }

  static put<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    return Api.getAxios().put(url, data, config);
  }

  static patch<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    return Api.getAxios().patch(url, data, config);
  }

  static request<T = unknown>(requestConfig: AxiosRequestConfig): AxiosPromise<T> {
    return Api.getAxios().request(requestConfig);
  }
}

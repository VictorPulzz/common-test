import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';

import { UserAuth } from '~/services';
import { isNil } from '~/utils';

import { ApiParams } from '../types';
import { setAuthorizationHeader } from './setAuthorizationHeader';

const retryKey = Symbol('request-retry');

let isRefreshing = false;
let failedQueue: { resolve(value: string): void; reject(reason: unknown): void }[] = [];

function runQueue({ error, token }: { error?: AxiosError; token?: string }): void {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
    promise.reject(undefined);
  });

  failedQueue = [];
}

export function hasUnauthorizedError(error: unknown, apiParams: ApiParams): error is AxiosError {
  const codes = apiParams.errorCodesTokenExpired || [401];
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const isRefreshTokenEndpoint =
    error.config.url === apiParams.refreshTokenUrl && error.config.method === 'POST';

  return (
    codes.includes(<number>error.response?.status) &&
    !isAxiosRequestRetry(error.config) &&
    !isRefreshTokenEndpoint
  );
}

export function isAxiosRequestRetry(
  config: AxiosRequestConfig & { [retryKey]?: boolean },
): boolean {
  return Boolean(config[retryKey]);
}

export function retryWithNewTokens(
  instance: AxiosInstance,
  error: AxiosError,
  apiParams: ApiParams,
): AxiosPromise {
  const config = <AxiosRequestConfig & { [retryKey]?: boolean }>error.config;
  if (isRefreshing) {
    return addToQueue(instance, config);
  }

  config[retryKey] = true;
  isRefreshing = true;

  return new Promise((resolve, reject) => {
    const refreshPromise = isNil(apiParams.refreshTokens)
      ? instance
          .post<UserAuth>(apiParams.refreshTokenUrl ?? '', { refresh: apiParams.getRefreshToken() })
          .then(({ data }) => data)
      : apiParams.refreshTokens({ instance, error });

    refreshPromise
      .then((data: UserAuth) => {
        apiParams.onTokenRefreshSuccess?.(data);

        // todo: does it really need? test without it
        // instance.defaults.headers.common.Authorization = `Bearer ${data.access}`;

        const token = data.access;
        config.headers = setAuthorizationHeader(token, config.headers);

        runQueue({ token });

        resolve(instance(config));
      })
      .catch(error => {
        apiParams.onTokenRefreshError?.(error);

        runQueue({ error });
        reject(error);
      })
      .then(() => {
        isRefreshing = false;
      });
  });
}

function addToQueue(instance: AxiosInstance, config: AxiosRequestConfig): AxiosPromise {
  return new Promise<string>((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  })
    .then(token => {
      config.headers = setAuthorizationHeader(token, config.headers);
      return instance(config);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

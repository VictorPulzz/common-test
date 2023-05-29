import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { Api, handleRequestError } from '~/services/api';
import { AnyObject, ResponseErrors } from '~/types';
import { isPlainObject } from '~/utils/object';

export interface AxiosBaseQueryParams {
  transformResponse?: (data: AxiosResponse['data']) => Record<string, any>;
  handleError?: (e: unknown) => any;
}

export interface AxiosBaseQueryError {
  status?: number;
  data: ResponseErrors | AxiosError['response'];
  extraOptions?: Record<string, any>;
}

/**
 * Implementation of axios base query using our Api service.
 * You should initialize Api service before using it.
 *
 * Example:
 * ~~~
 * import { axiosBaseQuery } from '@appello/common/lib/services/rtkQuery';
 * import { createApi } from '@reduxjs/toolkit/query/react';
 *
 * import { TAGS } from '~/services/rtkQuery/utils';
 *
 * export const rtkQuery = createApi({
 *   reducerPath: 'rtkReducer',
 *   baseQuery: axiosBaseQuery({ transformResponse: data => data.data }),
 *   tagTypes: Object.values(TAGS),
 *   endpoints: () => ({}),
 * });
 * ~~~
 *
 */

export const axiosBaseQuery =
  ({ transformResponse, handleError = handleRequestError }: AxiosBaseQueryParams = {}): BaseQueryFn<
    {
      extraOptions?: AnyObject;
    } & AxiosRequestConfig,
    unknown,
    AxiosBaseQueryError
  > =>
  async ({ extraOptions, method = 'GET', ...requestConfig }) => {
    try {
      const result = await Api.request<any>({ method, ...requestConfig });
      const response = transformResponse ? transformResponse(result.data) : result.data ?? {};
      return {
        data: isPlainObject(response)
          ? Object.assign(response, extraOptions ? { extraOptions } : {})
          : response,
      };
    } catch (e) {
      const error = <AxiosError>e;
      return {
        error: {
          status: error.response?.status,
          data: handleError(error),
          extraOptions,
        },
      };
    }
  };

import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { Api } from '~/services/api/Api';
import { handleRequestError } from '~/services/api/utils';
import { ResponseErrors } from '~/types';
import { isPlainObject } from '~/utils/object';

export interface AxiosBaseQueryParams {
  transformResponse?: (data: AxiosResponse['data']) => Record<string, any>;
}

export interface AxiosBaseQueryError {
  status?: number;
  data: ResponseErrors;
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
  ({ transformResponse }: AxiosBaseQueryParams = {}): BaseQueryFn<
    {
      extraOptions?: Record<string, any>;
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
      return {
        error: {
          status: (e as AxiosError).response?.status,
          data: handleRequestError(e),
          extraOptions,
        },
      };
    }
  };

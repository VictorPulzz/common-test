import { AxiosError, AxiosInstance, AxiosRequestHeaders } from 'axios';

import { UserAuth } from '~/types';

export interface ApiParams {
  apiUrl: string;

  /**
   * @default ''
   */
  refreshTokenUrl?: string;

  refreshTokens?: ({
    instance,
    error,
  }: {
    instance: AxiosInstance;
    error: AxiosError;
  }) => Promise<UserAuth>;

  /**
   * @default false
   */
  shouldTransformKeys?: boolean;
  getToken: () => string | undefined | null;
  getRefreshToken: () => string | undefined | null;
  onTokenRefreshSuccess?: (responseData: UserAuth) => void;
  onTokenRefreshError?: (error?: unknown) => void;
  timeout?: number;
  errorCodesTokenExpired?: number[];
  customHeaders?: () => AxiosRequestHeaders;
}

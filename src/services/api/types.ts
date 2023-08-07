import { AxiosInstance, AxiosRequestConfig } from 'axios';

import { UserAuth } from '~/types';

export interface ApiParams {
  apiUrl: string;

  /**
   * @default ''
   */
  refreshTokenUrl?: string;

  refreshTokens?: ({
    instance,
    config,
  }: {
    instance: AxiosInstance;
    config: AxiosRequestConfig;
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
}

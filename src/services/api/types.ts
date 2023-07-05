import { UserAuth } from '~/types';

export interface ApiParams {
  apiUrl: string;
  refreshTokenUrl: string;
  shouldTransformKeys?: boolean;
  getToken: () => string | undefined | null;
  getRefreshToken: () => string | undefined | null;
  onTokenRefreshSuccess?: (responseData: UserAuth) => void;
  onTokenRefreshError?: (error?: unknown) => void;
  timeout?: number;
}

import { ApolloClient, InMemoryCacheConfig } from '@apollo/client';

import { Nullable } from '../../types';
import { GQL_ERROR_CODE } from './consts';

export interface UserAuth {
  refresh: string;
  access: string;
}

export interface GqlClientContext {
  headers?: Record<string, unknown>;
  withoutAuth?: boolean;
}

export interface GqlErrorResponse {
  code: GQL_ERROR_CODE;
  explain?: Record<string, string>;
}

export interface GqlConfig {
  serverUrl: string;
  onUnknownError: (message: string) => void;
  getAccessToken: () => string | undefined;
  getRefreshToken: () => string | undefined;
  onTokenRefreshSuccess: (auth: UserAuth) => void;
  onTokenRefreshError: (error?: unknown) => void;
  refreshTokens: (
    client: ApolloClient<unknown>,
    context: GqlClientContext,
  ) => Promise<Nullable<UserAuth>>;
  refreshTokenOperationName?: string;
  cache?: InMemoryCacheConfig;
}

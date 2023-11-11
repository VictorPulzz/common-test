import { ApolloClient } from '@apollo/client';

import { Nullable } from '../../types';
import { GqlConfig } from './types';

export const gqlConfig: GqlConfig & { client: Nullable<ApolloClient<unknown>> } = {
  client: null,
  serverUrl: '',
  onUnknownError: () => undefined,
  getRefreshToken: () => '',
  getAccessToken: () => '',
  refreshTokens: async () => null,
  refreshTokenOperationName: 'RefreshTokens',
  onTokenRefreshSuccess: () => undefined,
  onTokenRefreshError: () => undefined,
};

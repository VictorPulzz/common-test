import { gqlConfig } from '../config';
import { GqlClientContext, UserAuth } from '../types';

export const refreshTokens = async (): Promise<UserAuth> => {
  const refreshToken = gqlConfig.getRefreshToken();
  const error = new Error('Tokens refresh failed');

  if (!refreshToken || !gqlConfig.client) {
    throw error;
  }

  const context: GqlClientContext = { withoutAuth: true };
  const auth = await gqlConfig.refreshTokens(gqlConfig.client, context);

  if (auth) {
    return auth;
  }

  throw error;
};

import { GraphQLError } from 'graphql/index';

import { GQL_ERROR_CODE } from '../consts';
import { getGqlErrorCode } from './getGqlError';

export function hasGqlUnauthorizedError(gqlErrors?: readonly GraphQLError[]): boolean {
  return getGqlErrorCode(gqlErrors) === GQL_ERROR_CODE.TOKEN_EXPIRED;
}

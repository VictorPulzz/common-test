import { GraphQLError } from 'graphql/index';

import { GQL_ERROR_CODE } from '../consts';
import { getGqlErrorCode } from './getGqlError';

export function hasGqlBusinessError(gqlErrors?: readonly GraphQLError[]): boolean {
  const code = getGqlErrorCode(gqlErrors);

  if (!code) {
    return false;
  }

  return [GQL_ERROR_CODE.UNPROCESSABLE_ENTITY, GQL_ERROR_CODE.RESOURCE_NOT_FOUND].includes(code);
}

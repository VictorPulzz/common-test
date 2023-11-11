import { GraphQLError } from 'graphql/index';

import { GQL_ERROR_CODE } from '../consts';
import { GqlErrorResponse } from '../types';

export function getGqlError(gqlErrors?: readonly GraphQLError[]): GqlErrorResponse | undefined {
  if (!gqlErrors) {
    return undefined;
  }

  return gqlErrors[0].extensions as unknown as GqlErrorResponse;
}

export function getGqlErrorCode(gqlErrors?: readonly GraphQLError[]): GQL_ERROR_CODE | undefined {
  return getGqlError(gqlErrors)?.code;
}

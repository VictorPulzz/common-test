import { GraphQLError } from 'graphql';
import { FieldPath } from 'react-hook-form';

import { GQL_ERROR_CODE } from '~/services/gql/consts';
import { entries } from '~/utils/object';

import { getGqlError } from './getGqlError';

interface CreateProcessGqlErrorResponseOptions {
  onNonFieldError: (message: string) => void;
  onUnhandledFieldErrors: (message: string) => void;
  onUnknownError: (message: string) => void;
}

interface ProcessGqlErrorResponseOptions<TFormValues> {
  fields?: FieldPath<TFormValues>[];
  setFieldError?: (name: FieldPath<TFormValues>, message: string) => void;
}

export function createProcessGqlErrorResponse(config: CreateProcessGqlErrorResponseOptions) {
  return function processGqlErrorResponse<TFormValues = Record<string, unknown>>(
    e: unknown,
    {
      fields,
      setFieldError,
      onNonFieldError = config.onNonFieldError,
      onUnhandledFieldErrors = config.onUnhandledFieldErrors,
      onUnknownError = config.onUnknownError,
    }: ProcessGqlErrorResponseOptions<TFormValues> &
      Partial<CreateProcessGqlErrorResponseOptions> = {},
  ): void {
    const graphQLErrors = (e as { graphQLErrors?: GraphQLError[] }).graphQLErrors;

    if (!graphQLErrors) {
      return;
    }

    const error = getGqlError(graphQLErrors);
    const { code, explain } = error || {};

    if (code !== GQL_ERROR_CODE.UNPROCESSABLE_ENTITY) {
      return;
    }

    if (!explain) {
      onUnknownError('An unknown error has occurred');
      return;
    }

    if ('non_field' in explain) {
      onNonFieldError(explain['non_field']);
      return;
    }

    const errors = explain as Record<FieldPath<TFormValues>, string>;
    const unhandledFieldErrors: { name: string; value: string }[] = [];

    entries(errors).forEach(([field, error]) => {
      if (fields && fields.includes(field) && setFieldError) {
        setFieldError(field, error);
      } else {
        unhandledFieldErrors.push({ name: field, value: error });
      }
    });

    if (unhandledFieldErrors.length > 0) {
      onUnhandledFieldErrors(JSON.stringify(unhandledFieldErrors));
    }
  };
}

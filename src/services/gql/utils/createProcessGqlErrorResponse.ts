import { GraphQLError } from 'graphql';
import { FieldPath, FieldValues } from 'react-hook-form';
import { UseFormSetError } from 'react-hook-form/dist/types/form';

import { entries, isPlainObject } from '../../../utils';
import { GQL_ERROR_CODE } from '../consts';
import { getGqlError } from './getGqlError';

interface CreateProcessGqlErrorResponseOptions {
  onNonFieldError: (message: string) => void;
  onUnhandledFieldErrors: (errors: UnhandledFieldError[]) => void;
  onUnknownError: (message: string) => void;
}

interface ProcessGqlErrorResponseOptions<TFormValues extends FieldValues> {
  fields?: Record<string, FieldPath<TFormValues>> | FieldPath<TFormValues>[];
  setFieldError?: (name: FieldPath<TFormValues>, message: string) => void;
  setFormError?: UseFormSetError<TFormValues>;
}

export interface UnhandledFieldError {
  name: string;
  value: string;
}

export function createProcessGqlErrorResponse(config: CreateProcessGqlErrorResponseOptions) {
  return function processGqlErrorResponse<
    TFormValues extends FieldValues = Record<string, unknown>,
  >(
    e: unknown,
    {
      fields = [],
      setFormError,
      setFieldError = setFormError ? (name, message) => setFormError(name, { message }) : undefined,
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
    const unhandledFieldErrors: UnhandledFieldError[] = [];

    entries(errors).forEach(([field, error]) => {
      let formField: FieldPath<TFormValues> | undefined;

      if (Array.isArray(fields)) {
        if (fields.some(v => v.startsWith(field))) {
          // startsWith is used to handle nested fields
          formField = field;
        }
      } else {
        formField = fields[field];
      }

      if (fields && formField && setFieldError) {
        if (isPlainObject(error)) {
          entries(error as Record<string, string>).forEach(([nestedField, nestedError]) => {
            setFieldError(`${formField}.${nestedField}` as FieldPath<TFormValues>, nestedError);
          });
        } else {
          setFieldError(formField, error);
        }
      } else {
        unhandledFieldErrors.push({ name: field, value: error });
      }
    });

    if (unhandledFieldErrors.length > 0) {
      onUnhandledFieldErrors(unhandledFieldErrors);
    }
  };
}

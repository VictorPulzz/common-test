import { FieldPath, FieldValues } from 'react-hook-form';
import { UseFormSetError } from 'react-hook-form/dist/types/form';

import { ResponseErrors } from '../../../types';
import { entries } from '../../../utils';
import { GLOBAL_ERROR_NAME } from '../constants';

interface CreateProcessApiErrorOptions {
  onGlobalError: (message: string) => void;
  onUnknownErrors: (message: string) => void;
}

export interface ProcessApiErrorOptions<TFormValues extends FieldValues> {
  errors: ResponseErrors;
  fields?: Record<string, FieldPath<TFormValues>> | FieldPath<TFormValues>[];
  setFieldError?: (name: FieldPath<TFormValues>, message: string) => void;
  setFormError?: UseFormSetError<TFormValues>;
}

export function createProcessApiError(config: CreateProcessApiErrorOptions) {
  return function processApiError<TFormValues extends FieldValues>({
    fields = {},
    setFormError,
    setFieldError = setFormError ? (name, message) => setFormError(name, { message }) : undefined,
    errors,
    onGlobalError = config.onGlobalError,
    onUnknownErrors = config.onUnknownErrors,
  }: ProcessApiErrorOptions<TFormValues> & Partial<CreateProcessApiErrorOptions>): void {
    const unknownErrors: { name: string; value: string }[] = [];

    if (errors[GLOBAL_ERROR_NAME]) {
      onGlobalError(errors[GLOBAL_ERROR_NAME]);
      return;
    }

    entries(errors).forEach(([field, error]) => {
      // eslint-disable-next-line no-nested-ternary
      const formField: FieldPath<TFormValues> | undefined = Array.isArray(fields)
        ? fields.includes(field as FieldPath<TFormValues>)
          ? (field as FieldPath<TFormValues>)
          : undefined
        : fields[field];

      if (formField && setFieldError) {
        setFieldError(formField, error);
      } else {
        unknownErrors.push({ name: field, value: error });
      }
    });

    if (unknownErrors.length > 0) {
      onUnknownErrors(`Oops! There are unknown errors: ${JSON.stringify(unknownErrors)}`);
    }
  };
}

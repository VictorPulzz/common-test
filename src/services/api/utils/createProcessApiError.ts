import { GLOBAL_ERROR_NAME } from '~/constants';
import { ResponseErrors } from '~/types';
import { entries } from '~/utils/object';

interface CreateProcessApiErrorOptions {
  onGlobalError: (message: string) => void;
  onUnknownErrors: (message: string) => void;
}

export interface ProcessApiErrorOptions<TFormValues> {
  errors: ResponseErrors;
  fields?: Record<string, keyof TFormValues> | (keyof TFormValues)[];
  setFieldError?: (name: keyof TFormValues, value: string) => void;
}

export function createProcessApiError({
  onGlobalError,
  onUnknownErrors,
}: CreateProcessApiErrorOptions) {
  return function processApiError<TFormValues>({
    fields = {},
    setFieldError,
    errors,
  }: ProcessApiErrorOptions<TFormValues>): void {
    const unknownErrors: { name: string; value: string }[] = [];

    if (errors[GLOBAL_ERROR_NAME]) {
      onGlobalError(errors[GLOBAL_ERROR_NAME]);
      return;
    }

    entries(errors).forEach(([field, error]) => {
      // eslint-disable-next-line no-nested-ternary
      const formField = Array.isArray(fields)
        ? fields.includes(field as keyof TFormValues)
          ? (field as keyof TFormValues)
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

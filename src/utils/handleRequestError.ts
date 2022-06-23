import axios from 'axios';

import { GLOBAL_ERROR_NAME } from '~/constants';
import { ResponseErrors } from '~/types';

/**
 * Function handles error from API
 */
export function handleRequestError(
  error: unknown,
  options: { handleRawErrors?: (errors: Record<string, any>) => void } = {},
): ResponseErrors {
  const { handleRawErrors } = options;

  const errors: ResponseErrors = {};

  if (!axios.isAxiosError(error)) {
    errors[GLOBAL_ERROR_NAME] = 'Something went wrong';
    return errors;
  }

  if (error.response) {
    switch (error.response.status) {
      case 400:
      case 403: {
        const { data } = error.response;
        if (!('detail' in data)) {
          errors[GLOBAL_ERROR_NAME] = 'Server error';
          break;
        }
        if (handleRawErrors) {
          handleRawErrors(data.detail);
        }
        Object.keys(data.detail).forEach(key => {
          if (!Array.isArray(data.detail[key])) {
            Object.keys(data.detail[key]).forEach((field: string) => {
              errors[`${key}_${field}`] = data.detail[key][field][0];
            });
          } else {
            errors[key] = data.detail[key][0];
          }
        });
        break;
      }
      case 401: {
        break;
      }
      default:
        // 500, 502
        errors[GLOBAL_ERROR_NAME] = 'Server error';
        break;
    }
  } else if (error.request) {
    if (error.request.status === 0) {
      errors[GLOBAL_ERROR_NAME] = 'Network error';
    }
  } else {
    errors[GLOBAL_ERROR_NAME] = 'Something went wrong';
  }

  if ('object_error' in errors) {
    errors[GLOBAL_ERROR_NAME] = errors.object_error;
    delete errors.object_error;
  }

  return errors;
}

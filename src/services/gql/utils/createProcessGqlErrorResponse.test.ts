import { GraphQLError } from 'graphql/index';

import { GQL_ERROR_CODE } from '../consts';
import {
  createProcessGqlErrorResponse,
  UnhandledFieldError,
} from './createProcessGqlErrorResponse';

test('is working correctly', async () => {
  let nonFieldError: string | undefined;
  let unhandledFieldErrors: UnhandledFieldError[] | undefined;
  let unknownError: string | undefined;
  const handledErrors: Record<string, string> = {};

  const processGqlErrorResponse = createProcessGqlErrorResponse({
    onNonFieldError: message => {
      nonFieldError = message;
    },
    onUnhandledFieldErrors: errors => {
      unhandledFieldErrors = errors;
    },
    onUnknownError: message => {
      unknownError = message;
    },
  });

  interface FormValues {
    name: string;
    password: string;
    user: {
      email: string;
    };
  }

  const nameErrorMessage = 'Name is required';
  const emailErrorMessage = 'Email is required';
  const gqlError = {
    graphQLErrors: [
      new GraphQLError('Failed', {
        extensions: {
          code: GQL_ERROR_CODE.UNPROCESSABLE_ENTITY,
          explain: {
            name: nameErrorMessage,
            user: {
              email: emailErrorMessage,
            },
          },
        },
      }),
    ],
  };

  processGqlErrorResponse<FormValues>(gqlError, {
    fields: ['name', 'user.email'],
    setFieldError: (name, message) => {
      handledErrors[name] = message;
    },
  });

  expect(handledErrors).toMatchObject({
    name: nameErrorMessage,
    'user.email': emailErrorMessage,
  });

  // todo: do test with react-hook-form's `setError` function
  // expect(form.formState.errors.name).toBe(nameErrorMessage);

  expect(nonFieldError).toBeUndefined();
  expect(unhandledFieldErrors).toBeUndefined();
  expect(unknownError).toBeUndefined();
});

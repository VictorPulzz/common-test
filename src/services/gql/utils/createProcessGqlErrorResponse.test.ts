import { GraphQLError } from 'graphql/index';

import { GQL_ERROR_CODE } from '~/services/gql/consts';

import {
  createProcessGqlErrorResponse,
  UnhandledFieldError,
} from './createProcessGqlErrorResponse';

test('is working correctly', async () => {
  let nonFieldError: string | undefined;
  let unhandledFieldErrors: UnhandledFieldError[] | undefined;
  let unknownError: string | undefined;
  const handledErrors: string[] = [];

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
  }

  const nameErrorMessage = 'Name is required';
  const gqlError = {
    graphQLErrors: [
      new GraphQLError('Failed', {
        extensions: {
          code: GQL_ERROR_CODE.UNPROCESSABLE_ENTITY,
          explain: {
            name: nameErrorMessage,
          },
        },
      }),
    ],
  };

  processGqlErrorResponse<FormValues>(gqlError, {
    fields: ['name'],
    setFieldError: (name, message) => handledErrors.push(message),
  });

  expect(handledErrors).toHaveLength(1);
  expect(handledErrors[0]).toBe(nameErrorMessage);

  // todo: do test with react-hook-form's `setError` function
  // expect(form.formState.errors.name).toBe(nameErrorMessage);

  expect(nonFieldError).toBeUndefined();
  expect(unhandledFieldErrors).toBeUndefined();
  expect(unknownError).toBeUndefined();
});

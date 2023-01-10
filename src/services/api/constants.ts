/**
 * Constants used for setting request content type.
 * Usage example:
 *
 * ~~~
 * export const userApi = rtkQuery.injectEndpoints({
 *   endpoints: builder => ({
 *     postUser: builder.mutation<PostUserResponse, PostUserVariables>({
 *       query: data => ({
 *         url: `/user`,
 *         method: 'POST',
 *         headers: { [CONTENT_TYPE_HEADER]: ContentType.FORM_DATA },
 *         data,
 *       }),
 *     }),
 *   }),
 * });
 * ~~~
 *
 */
export const CONTENT_TYPE_HEADER = 'Content-Type';

export enum ContentType {
  FORM_DATA = 'multipart/form-data',
  JSON = 'application/json',
}

/**
 * Using for errors from API
 */
export const GLOBAL_ERROR_NAME = 'globalError';

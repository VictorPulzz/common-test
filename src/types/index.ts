/**
 * Using for response errors from API
 */
export type ResponseErrors = Record<string, string>;

export type UnknownFunction = (...args: unknown[]) => unknown;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any) => any;

export interface UserAuth {
  refresh: string;
  access: string;
}

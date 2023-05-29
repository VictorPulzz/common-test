/**
 * Using for response errors from API
 */
export type ResponseErrors = Record<string, string>;

export type UnknownFunction = (...args: unknown[]) => unknown;

export type AnyFunction = (...args: any) => any;

export type AnyObject = Record<string, any>;

export interface UserAuth {
  refresh: string;
  access: string;
}

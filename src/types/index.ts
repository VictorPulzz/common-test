export type Nullable<T> = T | null;
export type NotNullable<T> = T extends null | undefined ? never : T;
export type Unidentifiable<T> = T | undefined;
export type Negative<T> = T | undefined | null | false;
export type ValueOf<T> = T[keyof T];
export type AnyObject = Record<string, any>;
export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
export type ResponseErrors = Record<string, string>;
export type UnknownFunction = (...args: unknown[]) => unknown;
export type AnyFunction = (...args: any) => any;

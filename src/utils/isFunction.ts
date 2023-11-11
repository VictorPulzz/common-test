import { AnyFunction } from '../types';

/**
 * Test argument for function
 *
 * ~~~
 * isFunction({}) // false
 * isFunction(() => {}) // true
 * ~~~
 */

export function isFunction<T extends AnyFunction>(arg: unknown): arg is T {
  return Object.prototype.toString.call(arg) === '[object Function]';
}

import { entries } from '~/utils/object';

/**
 * Function that makes query string from object. If value is undefined it will be skipped.
 *
 * ~~~
 * makeQueryString({ apple: 1, pear: undefined, peach: 3 }) // ?apple=1&peach=3
 * ~~~
 */
export function makeQueryString<T extends string | number>(
  params: Record<string, T | undefined>,
): string {
  return entries(params)
    .filter((pair): pair is [string, T] => pair[1] !== undefined)
    .map(([key, value], index) => {
      return `${index === 0 ? '?' : ''}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}

const prepareValue = (value: string): string => value.toLowerCase().replace(' ', '');

/**
 * Checks if `searchValue` partially matches `value`
 *
 * ~~~
 * matchSearchValue('jo', 'John') // true
 * matchSearchValue('johndoe', 'John') // false
 * ~~~
 */
export function matchSearchValue(search: string, value: string, ...values: string[]): boolean {
  return prepareValue(`${value} ${values.join(' ')}`).includes(prepareValue(search));
}

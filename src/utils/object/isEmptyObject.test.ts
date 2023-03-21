import { noop } from '~/utils';

import { isEmptyObject } from './isEmptyObject';

describe('isEmptyObject', () => {
  test('is working correctly', () => {
    expect(isEmptyObject({})).toBeTruthy();
    expect(isEmptyObject([])).toBeFalsy();
    expect(isEmptyObject(noop)).toBeFalsy();
    expect(isEmptyObject({ a: 1 })).toBeFalsy();
  });
});

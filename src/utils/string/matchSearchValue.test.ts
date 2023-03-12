import { matchSearchValue } from './matchSearchValue';

describe('matchSearchValue', () => {
  test('is working correctly', () => {
    expect(matchSearchValue('jo', 'John')).toBeTruthy();
    expect(matchSearchValue('jo', 'Doe', 'John')).toBeTruthy();
    expect(matchSearchValue('foo', 'Doe', 'John')).toBeFalsy();
  });
});

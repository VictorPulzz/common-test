import { toString } from './toString';

test('is working correctly', () => {
  expect(toString('0')).toBe('0');
  expect(toString(0)).toBe('0');
  expect(toString(null)).toBe('');
  expect(toString(undefined)).toBe('');
  expect(toString(false)).toBe('');
});

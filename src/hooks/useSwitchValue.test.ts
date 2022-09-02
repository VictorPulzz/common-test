import { act, renderHook } from '@testing-library/react';

import { useSwitchValue } from './useSwitchValue';

test('Testing initialState of useSwitchValue', () => {
  const { result } = renderHook(() => useSwitchValue(false));

  expect(result.current[0]).toBe(false);
});

test('Testing on() function', () => {
  const { result } = renderHook(() => useSwitchValue(false));

  act(() => {
    result.current[1]();
  });

  expect(result.current[0]).toBe(true);
});

test('Testing off() function', () => {
  const { result } = renderHook(() => useSwitchValue(false));

  act(() => {
    result.current[1]();

    result.current[2]();
  });

  expect(result.current[0]).toBe(false);
});

test('Testing toggle() function', () => {
  const { result } = renderHook(() => useSwitchValue(false));

  act(() => {
    result.current[3]();
  });

  expect(result.current[0]).toBe(true);

  act(() => {
    result.current[3]();
  });

  expect(result.current[0]).toBe(false);
});

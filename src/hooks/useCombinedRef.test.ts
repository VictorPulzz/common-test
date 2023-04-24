import { renderHook } from '@testing-library/react';
import { useRef } from 'react';

import { useCombinedRef } from './useCombinedRef';

describe('useCombinedRef', () => {
  test('is working correctly', () => {
    const { result } = renderHook(() => {
      const firstRef = useRef<number>(0);
      const secondRef = useRef<number>(0);
      const combinedRef = useCombinedRef(firstRef, secondRef);

      combinedRef(5);

      return firstRef.current;
    });

    expect(result.current).toEqual(5);
  });
});

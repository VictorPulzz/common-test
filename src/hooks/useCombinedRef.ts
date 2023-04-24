import React from 'react';

import { isFunction } from '~/utils';

export function useCombinedRef<T>(
  ...refs: (React.Ref<T> | React.MutableRefObject<T>)[]
): React.RefCallback<T> {
  return React.useCallback(
    (element: T) => {
      refs.forEach(ref => {
        if (isFunction(ref)) {
          ref(element);
        } else if (ref !== null) {
          (ref as React.MutableRefObject<T>).current = element;
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
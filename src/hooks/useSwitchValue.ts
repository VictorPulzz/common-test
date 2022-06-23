import React from 'react';

/**
 * Allows to control boolean value without additional callbacks
 *
 * ~~~
 * useSwitchValue(false) // [isModalOpen, openModal, closeModal]
 * ~~~
 */
export function useSwitchValue(initial: boolean): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = React.useState(initial);

  const off = React.useCallback(() => {
    setValue(false);
  }, []);

  const on = React.useCallback(() => {
    setValue(true);
  }, []);

  const toggle = React.useCallback(() => {
    setValue(state => !state);
  }, []);

  return React.useMemo(() => [value, on, off, toggle], [value, on, off, toggle]);
}

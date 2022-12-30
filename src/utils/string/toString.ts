export function toString(arg: unknown): string {
  if (typeof arg === 'number') {
    return Number.isNaN(arg) ? '' : `${arg}`;
  }

  return arg ? `${arg}` : '';
}

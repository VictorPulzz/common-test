export function toString(arg: unknown): string {
  if (typeof arg === 'number') {
    return `${arg}`;
  }

  return arg ? `${arg}` : '';
}

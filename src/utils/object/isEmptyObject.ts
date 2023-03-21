export function isEmptyObject(obj: Record<any, any>): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

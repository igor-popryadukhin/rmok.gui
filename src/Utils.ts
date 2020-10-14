
export function isEmpty (value: unknown): boolean {
  return (value === null ||
    value === '' ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'number' && isNaN(value)))
}

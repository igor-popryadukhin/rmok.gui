
export function isEmpty (value: unknown): boolean {
  return (value === null ||
    value === '' ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'number' && isNaN(value)))
}

/**
 * The method creates a new array with all the elements that passed the validation,
 * specified in the passed function.
 * Asynchronous!
 * @param arr
 * @param callback
 */
export async function filter (arr: any[], callback: any) {
  const fail = Symbol('filter')
  return (await Promise.all(arr.map(async (item: any) => (
    await callback(item)) ? item : fail
  ))).filter((i) => i !== fail)
}

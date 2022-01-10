
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
export async function filter (arr: unknown[], callback: CallableFunction) {
  const fail = Symbol('filter')
  return (await Promise.all(arr.map(async (item) => (
    await callback(item)) ? item : fail
  ))).filter((i) => i !== fail)
}

/**
 * @param ms
 */
export async function sleep (ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

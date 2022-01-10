export default function debounce (fn: CallableFunction, delay: number) {
  let timeoutId = null
  return (...args: unknown[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

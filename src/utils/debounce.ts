export default function debounce (fn: CallableFunction, delay: number, context = undefined) {
  let timeoutId = null
  return (...args: unknown[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.bind(context)(...args), delay)
  }
}

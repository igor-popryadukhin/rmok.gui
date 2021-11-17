type Callable<T> = (...args: any[]) => T

export default function debounce<T> (fn: Callable<T>, delay: number) {
  let timeoutId = 0 as any
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

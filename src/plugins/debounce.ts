import Vue from 'vue'

class Plugin {
  public install () {
    Vue.prototype.$debounce = (fn: Function, delay: number) => {
      let timeoutId = 0 as any
      return (...args: any[]) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
      }
    }
  }
}

Vue.use(new Plugin())

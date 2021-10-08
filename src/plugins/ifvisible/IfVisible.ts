// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ifvisible from 'ifvisible.js/src/ifvisible.min.js'

export default class IfVisible {
  public setIdleDuration (val: number): void {
    ifvisible.setIdleDuration(val)
  }

  public now (): boolean {
    return ifvisible.now()
  }

  public on (name: 'blur' | 'focus' | 'idle' | 'wakeup', handler: CallableFunction): void {
    ifvisible.on(name, handler)
  }

  public onEvery (val: number, handler: CallableFunction): void {
    ifvisible.onEvery(val, handler)
  }

  public blur (): void {
    ifvisible.blur()
  }

  public focus (): void {
    ifvisible.focus()
  }

  public idle (): void {
    ifvisible.idle()
  }

  public wakeup (): void {
    ifvisible.wakeup()
  }
}

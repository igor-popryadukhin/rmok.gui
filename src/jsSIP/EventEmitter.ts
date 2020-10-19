
export type EventHandler = (...args: any[]) => void
interface TH {
  event: string;
  handler: EventHandler;
}

export class EventEmitter {
  private _handlers: TH[] = []

  public emit (event: string, data: any) {
    this._handlers.forEach((th) => {
      if (event === th.event) {
        th.handler(data)
      }
    })
  }

  public on (event: string, handler: EventHandler) {
    this._handlers.push({
      event,
      handler
    })
  }

  public off (event: string) {
    while (true) {
      const index: number = this._handlers.findIndex((th: TH) => th.event === event)
      if (index > -1) {
        this._handlers.splice(index, 1)
      } else {
        break
      }
    }
  }
}

import debug from 'debug'

const sseLog = debug('SSE')

export type EventHandlerMessage = (event: MessageEvent) => void

interface Handler {
  name: string;
  handler: EventHandlerMessage;
}

export class SSE {
  private readonly _url: string
  private readonly _base?: string
  private _urlObject?: URL
  private _eventSource: EventSource | undefined
  private _handlersCount = 0
  private _handlers: Handler[] = []

  /**
   *
   * @param url
   * @param base
   */
  constructor (url: string, base?: string) {
    this._url = url
    this._base = base
  }

  public topic (name: string, handler: EventHandlerMessage): SSE {
    if (this._handlers.findIndex((h) => h.name === name) === -1) {
      sseLog('Регистрация обработчика: %o', handler)
      this._handlers.push({ name, handler })
    }
    return this
  }

  public subscribe (): void {
    sseLog('Слушаю сообщения')

    if (this._handlersCount === this._handlers.length) {
      // Повторная инициализация не нужна
    }

    this._handlersCount = this._handlers.length

    if (this._handlers.length === 0) {
      sseLog('Обработчики не зарегистрированы')
      return
    }

    this._urlObject = undefined
    this._urlObject = new URL(this._url, this._base)

    this._handlers.forEach((h) => {
      // eslint-disable-next-line no-unused-expressions
      this._urlObject?.searchParams.append('topic', h.name)
    })

    if (this._eventSource instanceof EventSource) {
      sseLog('Закрываю ранее открытое соединение')
      this._eventSource.close()

      this._handlers.forEach((h) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-unused-expressions
        this._eventSource?.removeEventListener(h.name, handler.bind(h))
      })

      this._eventSource = undefined
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._eventSource = new EventSource(this._urlObject, {
      withCredentials: true // В куках должен лежать mercureAuthorization = JWT
    })

    const handler = function (event: MessageEvent) {
      sseLog('Новое сообщение %o', event.lastEventId)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return this.handler(event)
    }

    this._handlers.forEach((h) => {
      // eslint-disable-next-line no-unused-expressions,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-unused-expressions
      this._eventSource?.addEventListener(h.name, handler.bind(h))
    })

    this._eventSource.onerror = (e) => {
      sseLog('Error %o', e)
    }
  }
}

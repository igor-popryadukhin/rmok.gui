import debug from 'debug'

const sseLog = debug('SSE')

export type EventHandlerMessage = (event: MessageEvent) => void

interface Handler {
  name: string;
  handler: EventHandlerMessage;
}

interface Topic {
  iri: string;
  value: string;
}

interface EventListener {
  type: string;
  handler: () => void;
}

export class SSE {
  private readonly _url: string
  private readonly _base?: string
  private _urlObject?: URL
  private _eventSource: EventSource | undefined
  private _topics: Topic[] = []
  private _events: EventListener[] = []

  /**
   *
   * @param url
   * @param base
   */
  constructor (url: string, base?: string) {
    this._url = url
    this._base = base
  }

  /**
   *
   * @param iri
   * @param value
   */
  public addTopic (iri: string, value: string): SSE {
    if (this._topics.findIndex((e) => e.iri === iri) > -1) {
      throw new Error('Еhe topic already exists.')
    }

    this._topics.push({ iri, value })
    return this
  }

  public addEventListener (type: string, listener: () => void): void {
    this._events.push({ type, listener })
  }

  public subscribe (): void {
    sseLog('Слушаю сообщения')

    if (this._handlers.length === 0) {
      sseLog('Обработчики не зарегистрированы')
      return
    }

    this._urlObject = undefined
    this._urlObject = new URL(this._url, this._base)

    this._topics.forEach(({ iri, value }) => {
      // eslint-disable-next-line no-unused-expressions
      this._urlObject?.searchParams.append(iri, value)
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

    this._events.forEach((e) => {
      // eslint-disable-next-line no-unused-expressions
      this._eventSource?.addEventListener(e.type, e.handler)
    })

    this._eventSource.onerror = (e) => {
      sseLog('Error %o', e)
    }
  }
}

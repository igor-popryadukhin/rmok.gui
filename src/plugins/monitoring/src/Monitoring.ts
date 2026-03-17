import debug from 'debug';
const wsDebug = debug('app').extend('WS');
const wsMessageDebug = wsDebug.extend('MESSAGE');

export default class Monitoring {
  get connected (): boolean {
    return this._socket.connected;
  }

  get cbToken (): CallableFunction {
    return this._cbToken;
  }

  set cbToken (value: CallableFunction) {
    this._cbToken = value;
  }

  private _cbToken: CallableFunction

  private _socket

  constructor () {
    import(/* webpackChunkName: "chunk-socket.io-client" */ 'socket.io-client')
      .then(({ io }) => {
        wsDebug('Инициализация...');
        this._socket = io(process.env.VUE_APP_MS_MONITORING_ENDPOINT, {
          path: '/ws',
          autoConnect: false,
          reconnection: true,
          secure: true,
          transports: ['websocket'],
          auth: (cb) => {
            cb({
              token: typeof this.cbToken === 'function' ? this.cbToken() : ''
            });
          }
        });

        this._socket.on('connect', () => {
          wsDebug('Подключен');

          this._socket.on('message', (data: any) => {
            wsMessageDebug('%o', data);
          });

          this._socket.on('disconnect', (data: any) => {
            wsDebug('Отключен');
          });
        });
      });
  }

  public connect () {
    this._socket.connect();
  }

  public disconnect () {
    this._socket.disconnect();
  }

  public emit (name: string, ...args) {
    this._socket.emit(name, ...args);
  }

  public send (...args) {
    this._socket.send(...args);
  }

  public on (name: string, handle: CallableFunction) {
    this._socket.on(name, handle);
  }

  public off (name: string, handle: CallableFunction) {
    this._socket.on(name, handle);
  }
}

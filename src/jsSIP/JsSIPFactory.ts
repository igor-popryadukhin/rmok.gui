import JsSIP, { UA, WebSocketInterface } from 'jssip'

/**
 * JSSIP
 */
export class JsSIPFactory {
  public static create (url: string, configuration: { password: string; uri: string }): UA {
    const socket: WebSocketInterface = new JsSIP.WebSocketInterface(url)
    return new JsSIP.UA({
      sockets: [socket],
      uri: configuration.uri,
      password: configuration.password
    })
  }
}

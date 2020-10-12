import JsSIP, { UA, WebSocketInterface } from 'jssip'

interface JsSPConfiguration {
  uri: string;
  password: string;
}

/**
 * JSSIP
 */
export class JsSIPFactory {
  /**
   * Make new instance
   * @param url
   * @param configuration
   */
  public static create (url: string, configuration: JsSPConfiguration): UA {
    const socket: WebSocketInterface = new JsSIP.WebSocketInterface(url)
    return new JsSIP.UA({
      sockets: [socket],
      uri: configuration.uri,
      password: configuration.password,
      register: true
    })
  }
}

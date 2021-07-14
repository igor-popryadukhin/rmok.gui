/* eslint-disable */
import JsSIP, { UA, WebSocketInterface } from 'jssip'

export interface JsSPConfiguration {
  uri: string;
  password?: string;
  display_name?: string | undefined;
  realm?: string;
  pcConfig?: RTCConfiguration;
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
      display_name: configuration.display_name,
      register: true,
      realm: configuration.realm || 'asterisk',
      contact_uri: configuration.uri,
      session_timers_refresh_method: 'invite',
      session_timers: true
    })
  }
}

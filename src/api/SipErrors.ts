import APIError from '@/api/classes/APIError'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export default class SipErrors {
  /**
   * Отправка ошибок SIP (WEBRTC)
   * @param data
   */
  public addLog (data: { message: string; context?: string }): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post('/logs/sips', data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }
}

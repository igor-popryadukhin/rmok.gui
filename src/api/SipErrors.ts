import APIError from '@/api/classes/APIError';
import { $axios } from '@/plugins/axios';
import { AxiosResponse } from 'axios';

export default class SipErrors {
  /**
   * Отправка ошибок SIP (WEBRTC)
   * @param data
   */
  public addLog (data: { message: string; context?: string }): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.post('/logs/sips', data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve();
          }
          throw new APIError(response.data);
        }).catch(reject);
    });
  }
}

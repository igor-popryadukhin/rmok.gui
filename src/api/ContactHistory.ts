/* eslint-disable */
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'


export default class ContactHistory {
  /**
   * Получить аудиозапись записи разговора
   *
   * @param historyId
   */
  public getAudioFile (historyId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/history/${historyId}/audio`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            reject(response.data)
          }
          resolve(response.data)
        }).catch(reject)
    })
  }
}

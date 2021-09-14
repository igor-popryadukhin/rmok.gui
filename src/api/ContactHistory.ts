/* eslint-disable */
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import APIError from '@/api/classes/APIError';

export default class ContactHistory {
  /**
   * Получить аудиозапись записи разговора
   *
   * @param historyId
   */
  public getAudioFile (historyId: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/history/${historyId}/audio`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }
          const type = response.headers['content-type']
          resolve(new Blob([response.data], { type }))
        }).catch(reject)
    })
  }
}

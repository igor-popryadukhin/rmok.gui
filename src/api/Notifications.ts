import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import APIError from './classes/APIError'
import Notification from './interfaces/Notification'
import ResponseInterface from '@/api/Schemas/ResponseInterface'

export default class Notifications {
  /**
   * Возвращает список оповещений текущего пользователя.
   * @param params
   */
  public get (params: { offset?: number, count?: number } = {}): Promise<ResponseInterface<{ count: number }, Notification[]>> {
    return new Promise((resolve, reject) => {
      $axios.get('/notifications', { params })
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          resolve(response.data)
        }).catch(reject)
    })
  }

  public close (id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.delete('/notifications/' + id)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          resolve()
        }).catch(reject)
    })
  }
}

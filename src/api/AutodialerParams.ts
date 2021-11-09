import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import APIError from './classes/APIError'
import ResponseInterface from './interfaces/ResponseInterface'
import Autodialer from './interfaces/Autodialer'

/**
 * Управление параметрами автодозвонщика.
 */
export default class AutodialerParams {
  /**
   * Получить список параметров.
   *
   * @param params
   */
  public get (params = {}): Promise<ResponseInterface<unknown, Autodialer[]>> {
    return new Promise((resolve, reject) => {
      $axios.get('/autodialer/params', {
        params
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        } else {
          resolve(response.data)
        }
      }).catch(reject)
    })
  }

  /**
   * Получить расширенную информацию о параметры используя идентификатор.
   *
   * @param id
   */
  public getById (id: number): Promise<Autodialer> {
    return new Promise((resolve, reject) => {
      $axios.get(`/autodialer/params/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          } else {
            resolve(response.data)
          }
        }).catch(reject)
    })
  }
}

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
  public get (params = {}): Promise<ResponseInterface<Record<string, any>, Autodialer[]>> {
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
   * Создаёт новый параметры автодозвона.
   * @param data
   */
  public create (data: Record<string, any>): Promise<number> {
    return new Promise((resolve, reject) => {
      $axios.post('/autodialer/params', data)
        .then((response: AxiosResponse) => {
          if (response.status !== 201) {
            throw new APIError(response.data)
          } else {
            resolve(response.data.id)
          }
        }).catch(reject)
    })
  }

  /**
   * Запускает процесс автообзвона
   * @param id
   */
  public start (id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.get(`/autodialer/params/${id}/start`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          } else {
            resolve(response.data)
          }
        }).catch(reject)
    })
  }

  /**
   * Останавливает процесс автообзвона
   * @param id
   */
  public stop (id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.get(`/autodialer/params/${id}/stop`)
        .then((response: AxiosResponse) => {
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

  /**
   * Вносит изменения в конфигурацию.
   *
   * @param id
   * @param data
   */
  public edit (id: number, data: Record<string, any>): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.patch(`/autodialer/params/${id}`, data)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          } else {
            resolve(response.data)
          }
        }).catch(reject)
    })
  }

  public getJournal (id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.get(`/autodialer/params/${id}/journal`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          } else {
            resolve(response.data)
          }
        }).catch(reject)
    })
  }

  /**
   *
   * @param id
   */
  public getStatsOnline (id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.get(`/autodialer/params/${id}/stats/online`)
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

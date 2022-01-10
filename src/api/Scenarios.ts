import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import APIError from './classes/APIError'
import ResponseInterface from './interfaces/ResponseInterface'
import Scenario from './interfaces/Scenario'

/**
 * Управление параметрами сценарий.
 */
export default class Scenarios {
  /**
   * Получить список сценариев.
   *
   * @param params
   */
  public get (params = {}): Promise<ResponseInterface<Record<string, unknown>, Scenario[]>> {
    return new Promise((resolve, reject) => {
      $axios.get('/scenarios', {
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
   * Создаёт новый сценарий.
   * @param data
   */
  public create (data: Record<string, unknown>): Promise<number> {
    return new Promise((resolve, reject) => {
      $axios.post('/scenarios', data)
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
   * Получить расширенную информацию о сценарий.
   *
   * @param id
   */
  public getById (id: number): Promise<Scenario> {
    return new Promise((resolve, reject) => {
      $axios.get(`/scenarios/${id}`)
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
   * Вносит изменения в сценарий.
   *
   * @param id
   * @param data
   */
  public edit (id: number, data: Record<string, unknown>): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.patch(`/scenarios/${id}`, data)
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
   * Удаляет сценарий
   * @param id
   */
  public delete (id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.delete(`/scenarios/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }
          resolve()
        }).catch(reject)
    })
  }
}

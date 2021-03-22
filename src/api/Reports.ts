import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import APIError from '@/api/classes/APIError'

export default class Reports {
  /**
   *
   * @param params
   */
  public pie<T> (params = {}): any {
    return new Promise<T>((resolve, reject) => {
      $axios.get('/reports/pie', {
        params: { ...params }
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data)
        } else {
          throw new APIError(response.data)
        }
      }).catch(reject)
    })
  }

  public history<TM, TD> (params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
      $axios.get('/reports/history', {
        params
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data)
        } else {
          throw new APIError(response.data)
        }
      }).catch(reject)
    })
  }

  public callCount<TM, TD> (params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
      $axios.get('/reports/call-count', {
        params
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data)
        } else {
          throw new APIError(response.data)
        }
      }).catch(reject)
    })
  }

  /**
   * Статистика активности
   *
   * @param params
   */
  public activity<TM, TD> (params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
      $axios.get('/reports/stats-activity', {
        params
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data)
        } else {
          throw new APIError(response.data)
        }
      }).catch(reject)
    })
  }
}

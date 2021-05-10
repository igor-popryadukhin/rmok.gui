import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import APIError from '@/api/classes/APIError'

export default class Statistics {
  /**
   * Количество звонков
   * @param params
   */
  public totalCalls (params = {}): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.get('/statistics/total-calls', {
        params: { ...params }
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          if (typeof response.data?.count !== 'number') {
            throw new Error('Invalid api response')
          }
          resolve(response.data?.count)
        } else {
          throw new APIError(response.data)
        }
      }).catch(reject)
    })
  }

  /**
   *
   * @param params
   */
  public pie<T> (params = {}): any {
    return new Promise<T>((resolve, reject) => {
      $axios.get('/statistics/pie', {
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
      $axios.get('/statistics/history', {
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
      $axios.get('/statistics/call-count', {
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
      $axios.get('/statistics/stats-activity', {
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
   * Статистика Несанкционированные перерывы
   *
   * @param params
   */
  public unauthorizedBreaks<TM, TD> (params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
      $axios.get('/statistics/unauthorized-breaks', {
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

import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import APIError from '@/api/classes/APIError'
import { ContactHistoryInterface } from '@/api/Schemas/ContactInterface'
import StatisticPie from '@/api/interfaces/StatisticPie'
import ContactHistory from '@/api/interfaces/ContactHistory'

export default class Statistics {
  /**
   * Статистика по последним вызовам.
   * --------------------------------
   * Вернёт общее количество звонков.
   * @param params
   */
  public recentCallsTotalCalls (params = {}): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.get('/statistics/recent-calls/total-calls', {
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
   * Статистика по последним вызовам.
   * --------------------------------
   * Вернёт данные круговой диаграммы.
   * @param params
   */
  public recentCallsPie (params = {}): Promise<StatisticPie> {
    return new Promise((resolve, reject) => {
      $axios.get('/statistics/recent-calls/pie', {
        params
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        resolve(response.data)
      }).catch(reject)
    })
  }

  /**
   * Статистика по последним вызовам.
   * --------------------------------
   * Вернёт данные истории по последним вызовам.
   * @param params
   */
  public recentCallsHistory (params = {}): Promise<ResponseInterface<{count: number}, ContactHistoryInterface[]>> {
    return new Promise((resolve, reject) => {
      $axios.get('/statistics/recent-calls/history', {
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
   * Статистика по всем вызовам
   * --------------------------------
   * @param params
   */
  public allCallsHistory (params = {}): Promise<ResponseInterface<{count: number}, ContactHistory[]>> {
    return new Promise((resolve, reject) => {
      $axios.get('/statistics/all-calls', {
        params
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }

        resolve(response.data)
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

import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export default class Reports {
  /**
   *
   * @param params
   */
  pie (params = {}): any {
    return new Promise<any>((resolve, reject) => {
      $axios.get('/reports/pie', {
        params: { ...params }
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data)
        } else {
          reject(response.data)
        }
      }).catch(reject)
    })
  }

  history (params = {}): any {
    return new Promise<any>((resolve, reject) => {
      $axios.get('/reports/history', {
        params: { ...params }
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data)
        } else {
          reject(response.data)
        }
      }).catch(reject)
    })
  }
}

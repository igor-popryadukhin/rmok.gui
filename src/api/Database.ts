import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export class Database {
  /**
   * Receives all telephone country codes of the world
   */
  public getCountryCodes (): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.get('/database/countries/codes')
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            reject(response.data)
          }
          resolve(response.data)
        }).catch(reject)
    })
  }
}

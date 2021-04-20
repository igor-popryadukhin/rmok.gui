import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export class Calls {
  /**
   * Receives all calls
   */
  public get (offset = 0, count = 100): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.get('/calls', {
        params: { count, offset }
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          reject(response.data)
        }
        resolve(response.data)
      }).catch(reject)
    })
  }
}

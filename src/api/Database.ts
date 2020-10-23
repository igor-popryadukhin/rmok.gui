import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface CountryCodeInterface {
  code: string;
  name: string;
}

export class Database {
  /**
   * Receives all telephone country codes of the world
   */
  public getCountryCodes (): Promise<CountryCodeInterface[] | any> {
    return new Promise((resolve, reject): Promise<CountryCodeInterface[] | any> | any => {
      $axios.get('/database/countries/codes')
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            reject(response.data)
          }
          resolve(response.data as CountryCodeInterface[])
        }).catch(reject)
    })
  }
}

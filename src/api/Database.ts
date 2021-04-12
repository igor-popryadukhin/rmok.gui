import APIError from '@/api/classes/APIError'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface CountryCodeInterface {
  name: string;
  name2: string;
  country_code: string;
  country_calling_code: string;
  example_format: string;
  example: string;
  region: string;
}

export interface StatusGroupInterface {
  id: number;
  name: string;
}

export interface StatusInterface {
  id: number;
  name: string;
  color: string;
  group?: StatusGroupInterface;
  statuses?: unknown & {
    id: number;
    name: string;
  };
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

  /**
   * Список статусов
   */
  public statuses<TM = null, TD = StatusInterface[]> (params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
      $axios.get('/database/statuses', {
        params
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          resolve(response.data)
        }
        throw new APIError(response.data)
      }).catch(reject)
    })
  }
}

import APIError from '@/api/classes/APIError'
import TimeZone from '@/api/interfaces/TimeZone'
import Country from '@/api/interfaces/Country'
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
   * Возвращает список стран.
   */
  public getCountries (): Promise<Country[]> {
    return new Promise((resolve, reject) => {
      $axios.get('/database/countries')
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }
          resolve(response.data)
        }).catch(reject)
    })
  }

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

  public getTimeZone (): Promise<TimeZone[] | any> {
    return new Promise((resolve, reject): Promise<TimeZone[] | any> | any => {
      $axios.get('/database/timezones')
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            reject(response.data)
          }
          resolve(response.data as TimeZone[])
        }).catch(reject)
    })
  }
}

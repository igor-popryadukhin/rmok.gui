import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import APIError from './classes/APIError'

export interface AttributeInterface {
  title: string;
  name: string;
  granted: boolean;
}

export interface PermissionInterface {
  title: string;
  attributes: AttributeInterface[];
}

export default class Permissions {
  /**
   * Получить список разрешений пользователя
   *
   * @param id
   */
  public get<T = PermissionInterface[]> (id: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      $axios.get(`/permissions/${id}`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Установить разрешения пользователю
   *
   * @param id
   * @param params
   */
  public set<T = { attribute: string; granted: boolean }> (id: number, params: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      $axios.patch(`/permissions/${id}`, params)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }
}

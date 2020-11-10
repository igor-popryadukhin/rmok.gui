/* eslint-disable */
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface RoleInterface {
  id: string;
  name: string;
  attributes: string[];
}

export class Roles {
  public get (): Promise<RoleInterface[] | any> | any {
    return new Promise((resolve, reject): Promise<RoleInterface[] | any> | any => {
      $axios.get('/roles')
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          resolve(false)
        }).catch(reject)
    })
  }

  public getById (id: string): Promise<RoleInterface | any> | any {
    return new Promise((resolve, reject): Promise<RoleInterface | any> | any => {
      $axios.get(`/roles/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data.result)
          }
          resolve(false)
        }).catch(reject)
    })
  }
}

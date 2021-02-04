import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface RoleInterface {
  id: string;
  name: string;
  attributes: string[];
}

export class Roles {
  public get<T = RoleInterface> (): Promise<T[] | any> {
    return new Promise((resolve, reject): Promise<T[] | any> | any => {
      $axios.get('/roles')
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  public getById<T = RoleInterface> (id: string): Promise<T | any> | any {
    return new Promise<T | any>((resolve, reject) => {
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

export default Roles

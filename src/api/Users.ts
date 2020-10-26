import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { RoleInterface } from '@/api/Roles'
import { GroupInterface } from '@/api/Groups'

interface UserOrganizationInterface {
  id: number;
  name: string;
}

export interface UserInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  login: string;
  email: string;
  phone: string;
  role?: RoleInterface | null;
  group?: GroupInterface | null;
  organization?: UserOrganizationInterface | null;
}

export class Users {
  /**
   * Add new user
   * @param data
   */
  public add (data: any): Promise<any> {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.post('/users', data)
        .then((response: AxiosResponse) => {
          if (response.status === 201) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   *
   * @param id
   */
  public getById (id: number): Promise<UserInterface | any> {
    return new Promise((resolve, reject): Promise<UserInterface | any> | any => {
      $axios.get(`/users/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   *
   * @param q
   * @param roleId
   * @param offset
   * @param count
   */
  public findUsers (q = '', roleId = 0, offset = 0, count = 100): Promise<any> {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.get('/users', {
        params: {
          /* eslint-disable */
          q,
          role_id: roleId,
          offset,
          count
          /* eslint-enable */
        }
      })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }
}

/* eslint-disable */
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { RoleInterface } from '@/api/Roles'
import { GroupInterface } from '@/api/Groups'
import PBXInterface from '@/api/Schemas/PBXInterface'

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
  pbx_config?: PBXInterface;
}

interface ParamsFindInterface {
  q?: string;
  roles?: string;
  organization_id?: number;
  project_id?: number;
  offset?: number;
  count?: number;
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
   * @param id
   * @param data
   */
  public update (id: number, data: any): Promise<any> {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.put(`/users/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
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
  public getById (id: number): Promise<UserInterface | any> | any {
    return new Promise<UserInterface | any>((resolve, reject): Promise<UserInterface | any> | any => {
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
   * @param params
   */
  public find (params: ParamsFindInterface = {}): Promise<any> {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.get('/users', {
        params: {
          /* eslint-disable */
          ...params
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

export default Users

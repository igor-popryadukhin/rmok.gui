import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import APIError from '@/api/classes/APIError'

export interface GroupResponsibleInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface GroupOrganizationInterface {
  id: number;
  name: string;
}

export interface GroupInterface {
  id: number;
  name: string;
  responsible?: GroupResponsibleInterface | null;
  organization?: GroupOrganizationInterface | null;
}

export interface GroupFindQueryInterface {
  q?: string;
  organization_id?: number;
  offset?: number;
  count?: number;
}

export class Groups {
  /**
   * Поиск групп
   * @param params
   */
  public find (params: GroupFindQueryInterface = {}): Promise<ResponseInterface<any, any> | any> {
    return new Promise<ResponseInterface<any, any>>((resolve, reject): Promise<GroupInterface[] | any> | any => {
      $axios.get('/groups', { params })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          } else {
            reject(response.data)
          }
        }).catch(reject)
    })
  }

  /**
   * Add a new group to the server
   * @param data
   */
  public add (data: any): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post('/groups', data)
        .then((response: AxiosResponse) => {
          if ([200, 201].includes(response.status)) {
            return resolve(response.data.id)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Update group
   * @param id
   * @param data
   */
  public update (id: number, data: any): Promise<any> | any {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.put(`/groups/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Delete group
   * @param id
   */
  public delete<T = any> (id: number): Promise<APIError | T> {
    return new Promise<APIError | T>((resolve, reject) => {
      $axios.delete(`/groups/${id}`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  public getById (id: number): Promise<GroupInterface> {
    return new Promise((resolve, reject): Promise<GroupInterface> | any => {
      $axios.get(`/groups/${id}`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }
}

export default Groups

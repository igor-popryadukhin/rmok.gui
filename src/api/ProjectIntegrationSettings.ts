import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import APIError from '@/api/classes/APIError'

export interface OrganizationInterface {
  id: number;
  name: string;
}

export interface GroupInterface {
  id: number;
  main_project_id: number;
  half_project_id: number;
  cross_project_id: number;
  half_cross_project_id: number;
  half_cross_tag: string;
  half_tag: string;
  cross_tag: string;
  main_tag: string;
  organization?: OrganizationInterface | null;
}

export interface ProfileFindQueryInterface {
  q?: string;
  organization_id?: number;
  offset?: number;
  count?: number;
}

export class ProjectIntegrationSettings {
  /**
   * Поиск групп
   * @param params
   */
  public find (params: ProfileFindQueryInterface = {}): Promise<ResponseInterface<any, any> | any> {
    return new Promise<ResponseInterface<any, any>>((resolve, reject): Promise<GroupInterface[] | any> | any => {
      $axios.get('/configurations/projectintegration', { params })
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
   *
   * @param ids
   * @param params
   */
  public getByIds<TM, TD = GroupInterface[]> (ids: number[], params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise((resolve, reject): Promise<GroupInterface> | any => {
      $axios.get('/configurations/projectintegration', {
        params: Object.assign({}, { target_groups: ids }, params)
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          return resolve(response.data)
        }
        throw new APIError(response.data)
      }).catch(reject)
    })
  }

  /**
   * Add a new group to the server
   * @param data
   */
  public add (data: any): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post('/configurations/projectintegration', data)
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
      $axios.patch(`/configurations/projectintegration/${id}`, data)
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
      $axios.delete(`/configurations/projectintegration/${id}`)
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
      $axios.get(`/configurations/projectintegration/${id}`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }
}

export default ProjectIntegrationSettings

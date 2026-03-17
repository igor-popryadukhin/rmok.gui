import { $axios } from '@/plugins/axios';
import { AxiosResponse } from 'axios';
import ResponseInterface from '@/api/Schemas/ResponseInterface';
import APIError from '@/api/classes/APIError';

export interface OrganizationInterface {
  id: number;
  name: string;
}

export interface ProjectInterface {
  id: number;
  name: string;
  description: string;
  created_at: number;
}

export interface ProfileInterface {
  id: number;
  main_project?: ProjectInterface | null;
  half_project?: ProjectInterface | null;
  cross_project?: ProjectInterface | null;
  half_cross_project?: ProjectInterface | null;
  half_cross_tag: string;
  half_tag: string;
  cross_tag: string;
  main_tag: string;
  name: string;
  external_project_id: string;
  organization?: OrganizationInterface | null;
  active: boolean;
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
    return new Promise<ResponseInterface<any, any>>((resolve, reject): Promise<ProfileInterface[] | any> | any => {
      $axios.get('/configurations/projectintegration', { params })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data);
          } else {
            reject(response.data);
          }
        }).catch(reject);
    });
  }

  /**
   *
   * @param ids
   * @param params
   */
  public getByIds<TM, TD = ProfileInterface[]> (ids: number[], params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise((resolve, reject): Promise<ProfileInterface> | any => {
      $axios.get('/configurations/projectintegration', {
        params: Object.assign({}, { target_groups: ids }, params)
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          return resolve(response.data);
        }
        throw new APIError(response.data);
      }).catch(reject);
    });
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
            return resolve(response.data.id);
          }
          reject(response.data);
        }).catch(reject);
    });
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
            return resolve(response.data);
          }
          reject(response.data);
        }).catch(reject);
    });
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
            return resolve(response.data);
          }
          throw new APIError(response.data);
        }).catch(reject);
    });
  }

  public getById (id: number): Promise<ProfileInterface> {
    return new Promise((resolve, reject): Promise<ProfileInterface> | any => {
      $axios.get(`/configurations/projectintegration/${id}`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve(response.data);
          }
          reject(response.data);
        }).catch(reject);
    });
  }

  /**
   *
   * @param id
   * @param state
   * @throws APIError|Error
   */
  public setActive (id: number, state: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.get(`/configurations/projectintegration/${id}/active/${state ? 1 : 0}`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            resolve(response.data);
          } else {
            throw new APIError(response.data);
          }
        }).catch(reject);
    });
  }
}

export default ProjectIntegrationSettings;

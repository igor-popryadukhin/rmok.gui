/* eslint-disable */
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import ResponseInterface from '@/api/Schemas/ResponseInterface';

export interface ProjectOwnerInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface ProjectOrganizationInterface {
  id: number;
  name: string;
}

export interface ProjectMemberInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
}

export interface ProjectInterface {
  id: number;
  name: string;
  comment: string;
  owner: ProjectOwnerInterface;
  organization: ProjectOrganizationInterface;
  members: ProjectMemberInterface[];
  statuses: StatusInterface[];
  created_at: number;
}

export interface StatusInterface {
  id: number;
  name: number;
}

export interface ProjectResponseItemsInterface {
  count: number;
  items: ProjectInterface[];
}

interface ProjectPostDataInterface {
  name: string;
  organization_id?: number;
  members: number[];
  statuses: [];
}

interface ProjectPutDataInterface {
  name: string;
  organization_id?: number;
  members: number[];
  statuses: [];
}

export default class Projects {
  /**
   * @param params
   */
  public find<TM, TD>(params: any): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
      $axios.get('/projects', {
        params
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          return resolve(response.data)
        }
        reject(response.data)
      }).catch(reject)
    })
  }

  /**
   * Add new project
   * @param data
   */
  public add (data: ProjectPostDataInterface): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $axios.post('/projects', data)
        .then((response: AxiosResponse) => {
          if ([200, 201].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
      }).catch(reject)
    })
  }

  /**
   * Get current user project.
   */
  public current (): Promise<ProjectInterface | any> | any {
    return new Promise((resolve, reject): Promise<ProjectInterface | any> | any => {
      $axios.get('/projects/current')
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Add new project
   * @param id
   * @param data
   */
  public update (id: number, data: ProjectPostDataInterface): Promise<ProjectResponseItemsInterface> {
    return new Promise<ProjectResponseItemsInterface>((resolve, reject) => {
      $axios.put(`/projects/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data as ProjectResponseItemsInterface)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Получить проект по идентификатору
   * @param id
   */
  public getById (id: number): Promise<ProjectInterface | any> | any {
    return new Promise<ProjectInterface | any>((resolve, reject) => {
      $axios.get(`/projects/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Удалить проект используя идентификатор проекта
   * @param id
   */
  public delete (id: number): Promise<any> | any {
    return new Promise<ProjectInterface | any>((resolve, reject) => {
      $axios.delete(`/projects/${id}`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }
}

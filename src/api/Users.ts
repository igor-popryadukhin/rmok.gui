/* eslint-disable */
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { RoleInterface } from '@/api/Roles'
import { GroupInterface } from '@/api/Groups'
import PBXInterface from '@/api/Schemas/PBXInterface'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import {ProjectInterface} from '@/api/Projects'
import APIError from './classes/APIError'


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
  role?: RoleInterface;
  group?: GroupInterface;
  organization?: UserOrganizationInterface;
  project?: ProjectInterface;
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
  public add<T = any>(data: any): Promise<T> {
    return new Promise<T>((resolve, reject): Promise<any> | any => {
      $axios.post('/users', data)
        .then((response: AxiosResponse) => {
          if ([200, 201].includes(response.status)) {
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
  public update (id: number, data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.patch(`/users/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Метод удаляет пользователя
   * @param id идентификатор пользователя
   * @param payload
   */
  public delete (id: number, payload = {}): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.delete(`/users/${id}`, {
        data: payload
      }).then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   *
   * @param id
   * @param params
   */
  public getById (id: number, params = {}) {
    return new Promise<UserInterface>((resolve, reject) => {
      $axios.get(`/users/${id}`, { params })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   *
   * @param params
   */
  public find<TM, TD>(params: any): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
      $axios.get('/users', {
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
   * Установить проект пользователю
   *
   * @param user_id     Идентификатор пользователя
   * @param project_id  Идентификатор проекта
   */
  public setProject (user_id: number, project_id: number): Promise<AxiosResponse | any> {
    return new Promise<AxiosResponse>((resolve, reject): Promise<AxiosResponse> | any => {
      $axios.get(`/users/${user_id}/projects/${project_id}`, {})
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }
}

export default Users

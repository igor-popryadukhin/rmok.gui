/* eslint-disable */
import PBXConfig from '@/api/interfaces/PBXConfig';
import User from '@/api/interfaces/User';
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { RoleInterface } from '@/api/Roles'
import { GroupInterface } from '@/api/Groups'
import PBXInterface from '@/api/Schemas/PBXInterface'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import {ProjectInterface} from '@/api/Projects'
import * as QP from 'QP'
import * as RS from 'RS'
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
  projects?: ProjectInterface[];
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
   * Создает нового пользователя.
   *
   * @param data
   */
  public create<T = any> (data: T): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post('/users', data)
        .then((response: AxiosResponse) => {
          if ([201].includes(response.status)) {
            return resolve(response.data.id)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * @param id
   * @param data
   */
  public edit (id: number, data: any): Promise<void> {
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
   * Возвращает расширенную информацию о пользователе.
   *
   * @param id
   * @param params
   */
  public getById (id: number, params = {}): Promise<User> {
    return new Promise<User>((resolve, reject) => {
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
   * Получить список пользователей по их идентификаторам
   *
   * @param ids     Массив идентификаторов пользователей
   * @param params
   */
  public getByIds<TM, TD = unknown & UserInterface[]> (ids: number[], params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
      $axios.get('/users', {
        params: Object.assign({}, { target_users: ids }, params)
      })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Возвращает список пользователей в соответствии с заданным критерием поиска.
   * @param params
   */
  public find (params = {}): Promise<ResponseInterface<{ count: 0 }, User[]>> {
    return new Promise((resolve, reject) => {
      $axios.get('/users', {
        params
      }).then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }
          resolve(response.data)
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

  /**
   * Установить график для пользователя
   *
   * @param user_id     Идентификатор пользователя
   * @param data
   */
  public setSchedule (user_id: number, data: QP.Schedule[]): Promise<void> {
    return new Promise<void>((resolve, reject): Promise<void> | any => {
      $axios.patch(`/users/${user_id}/schedule`, data)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  public getSchedule (user_id: number): Promise<RS.ScheduleInterface[]> {
    return new Promise<RS.ScheduleInterface[]>((resolve, reject) => {
      $axios.get(`/users/${user_id}/schedule`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Возвращает данные параметров пользователя для подключения к телефонии.
   *
   * @param user_id
   */
  public getPBX (user_id: number): Promise<PBXConfig> {
    return new Promise<PBXConfig>((resolve, reject) => {
      $axios.get(`/users/${user_id}/pbx-configuration`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Сохраняет параметры подключения к телефонии.
   *
   * @param user_id
   * @param params
   */
  public savePBX (user_id: number, params: PBXConfig): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.put(`/users/${user_id}/pbx-configuration`, params)
        .then((response: AxiosResponse) => {
          if ([200, 201].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Удаляет параметры подключения к телефонии.
   *
   * @param user_id
   */
  public deletePBX (user_id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.delete(`/users/${user_id}/pbx-configuration`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }
}

export default Users

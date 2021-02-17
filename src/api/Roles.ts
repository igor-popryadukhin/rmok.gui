import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import APIError from '@/api/classes/APIError'

export interface RoleInterface {
  id: string;
  name: string;
  permissions: string[];
}

export class Roles {
  /**
   * Возвращает список ролей
   *
   * @param params
   */
  public get<T = RoleInterface[]> (params = {}): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      $axios.get('/roles', { params })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Возвращает информацию о заданной роли
   *
   * @param id
   */
  public getById<T = RoleInterface> (id: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      $axios.get(`/roles/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Создает новую роль в системе.
   *
   * @param data
   */
  public add (data: any): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post('/roles', data)
        .then((response: AxiosResponse) => {
          if ([200, 201].includes(response.status)) {
            return resolve(response.data.id)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Редактирует роли
   *
   * @param id Идентификатор роли
   * @param data Данные для редактирования
   */
  public edit (id: number, data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.put(`/roles/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Удаляет роль
   *
   * @param id
   */
  public delete (id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.delete(`/roles/${id}`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }
}

export default Roles

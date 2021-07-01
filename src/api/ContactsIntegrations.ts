import APIError from '@/api/classes/APIError'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import * as RS from 'RS'

export default class ContactsIntegrations {
  /**
   *
   * @param params
   */
  public find (params: unknown & {
    /** Поиск по ключевому слову */
    q?: string;
    /** Идентификатор проекта */
    project_id?: number,
    /** Идентификатор пользователя */
    user_id?: number,
    offset?: number,
    count?: number
  } = {}): Promise<ResponseInterface<{ count: number }, RS.ContactIntegration[]>> {
    return new Promise((resolve, reject) => {
      $axios.get('/contacts/integrations', {
        params
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data)
        } else {
          throw new APIError(response.data)
        }
      }).catch(reject)
    })
  }

  /**
   * Присоединить
   *
   * @throws APIError|Error
   * @param project_id
   * @param user_id
   */
  public add (project_id: number, user_id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/integrations/projects/${project_id}/users/${user_id}/add`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            resolve(response.data)
          } else {
            throw new APIError(response.data)
          }
        }).catch(reject)
    })
  }

  /**
   *
   * @param id
   * @param data
   * @throws APIError|Error
   */
  public edit (id: number, data: { limit?: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.patch(`/contacts/integrations/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            resolve(response.data)
          } else {
            throw new APIError(response.data)
          }
        }).catch(reject)
    })
  }

  /**
   *
   * @param id
   * @param state
   * @throws APIError|Error
   */
  public setActive (id: number, state: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/integrations/${id}/active/${state ? 1 : 0}`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            resolve(response.data)
          } else {
            throw new APIError(response.data)
          }
        }).catch(reject)
    })
  }
}

import { $axios } from '@/plugins/axios'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import ContactTag from '@/api/interfaces/ContactTag'
import { AxiosResponse } from 'axios'
import APIError from '@/api/classes/APIError'

export default class ContactTags {
  /**
   * Поиск тегов
   *
   * @param params
   */
  public find (params = {}): Promise<ResponseInterface<any, ContactTag[]>> {
    return new Promise((resolve, reject) => {
      $axios.get('/contacts/tags', { params })
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response?.data || response.statusText)
          }
          resolve(response.data)
        }).catch(reject)
    })
  }

  /**
   * Массовая установка тегов для контактов
   * @param params
   */
  public setTags (params = {}): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post('/contacts/tags/set', params)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data?.count || 0)
          }
          throw new APIError(response?.data || response.statusText)
        }).catch(reject)
    })
  }

  /**
   * Добавить новый тег в систему
   * @param data
   */
  public addTag (data: unknown & { name: string; color: string; }): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post('/contacts/tags', data)
        .then((response: AxiosResponse) => {
          if ([200, 201].includes(response.status)) {
            return resolve(response.data?.id || 0)
          }
          throw new APIError(response?.data || response.statusText)
        }).catch(reject)
    })
  }
}

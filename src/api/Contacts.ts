import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { ContactInterface } from './Schemas/ContactInterface'

export interface ContactResponseInterface {
  count: number;
  items: ContactInterface[];
}

export class Contacts {
  /**
   * Поиск контактов
   *
   * @param q
   * @param offset
   * @param count
   */
  search (q = '', offset = 0, count = 100): Promise<ContactResponseInterface> {
    return new Promise((resolve, reject) => {
      $axios.get('/contacts', {
        params: {
          q, offset, count
        }
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          const data: ContactResponseInterface = response.data
          data.items = data.items.map((e) => {
            e.checked = false
            return e
          })
          resolve(data)
        }
      }).catch(reject)
    })
  }

  /**
   * @param id
   */
  delete (id: number): Promise<unknown> {
    return new Promise((resolve, reject) => {
      $axios.delete(`/contacts/${id}`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve()
          }
          return reject(response)
        }).catch(reject)
    })
  }
}

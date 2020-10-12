import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { ContactInterface } from './Schemas/ContactInterface'
import { CheckedInterface } from '@/api/Schemas/СheckedInteface'

interface Contact extends ContactInterface, CheckedInterface {}

export interface ContactResponseInterface {
  count: number;
  items: Contact[];
}

export class Contacts {
  /**
   * Поиск контактов
   *
   * @param q
   * @param offset
   * @param count
   */
  public search (q = '', offset = 0, count = 100): Promise<ContactResponseInterface> {
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
   *
   * @param id
   */
  public getById (id: number): Promise<unknown> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            resolve(response.data)
            return
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * @param id
   */
  public delete (id: number): Promise<unknown> {
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

  /* eslint-disable */
  /**
   * Retrieve a contact's call history
   * @param contact_id
   * @param offset
   * @param count
   */
  public history (contact_id: number, offset = 0, count = 100): Promise<unknown> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/${contact_id}/history`, {
        params: { offset, count }
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          reject (response.data)
        }
        resolve(response.data)
      }).catch(reject)
    })
  }
  /* eslint-enable */
}

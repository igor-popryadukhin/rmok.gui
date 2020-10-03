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
          resolve(response.data)
        }
      }).catch(reject)
    })
  }
}

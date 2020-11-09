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
   * Add new contact
   * @param data
   */
  public add (data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.post('/contacts', data)
        .then((response: AxiosResponse) => {
          if ([200, 201].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.statusText)
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
   *
   * @param contactId
   * @param phoneNumberId
   */
  public setDefaultPhoneNumber (contactId: number, phoneNumberId: number): Promise<unknown> {
    return new Promise((resolve, reject) => {
      $axios.patch(`/contacts/${contactId}/phone/${phoneNumberId}/default`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Get contact by phone number
   * @param number
   */
  public getByPhoneNumber (number: string): Promise<ContactInterface> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/${number}`)
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
   * @param filter
   * @param offset
   * @param count
   */
  public getHistory (contact_id: number, filter = '', offset = 0, count = 100): Promise<any> {
    return new Promise((resolve, reject) => {
      const query: any = {}
      if (filter) { query.filter = filter }
      $axios.get(`/contacts/${contact_id}/history`, {
        params: { offset, count, ...query }
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          reject (response.data)
        }
        resolve(response.data)
      }).catch(reject)
    })
  }
  /* eslint-enable */

  /**
   * @param historyId
   */
  public getHistoryById (historyId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/history/${historyId}`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            reject(response.data)
          }
          resolve(response.data)
        }).catch(reject)
    })
  }

  /**
   * Add information about the current session
   * @param contactId
   * @param data
   */
  public addHistory (contactId: number, data: any): Promise<number | any> {
    return new Promise((resolve, reject): Promise<number | any> | any => {
      $axios.post(`/contacts/${contactId}/history`, data)
        .then((response: AxiosResponse) => {
          if (![200, 201].includes(response.status)) {
            reject(response.data)
          }
          resolve(response.data.id)
        }).catch(reject)
    })
  }

  /**
   * Update history data
   * @param historyId
   * @param data
   */
  public updateHistory (historyId: number, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.patch(`/contacts/history/${historyId}`, data)
        .then((response: AxiosResponse) => {
          if (![200, 204].includes(response.status)) {
            reject(response.data)
          }
          resolve(response.data)
        }).catch(reject)
    })
  }

  /**
   * Get contact labels
   */
  public getLabels (): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.get('/contacts/labels')
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            return reject(response.data)
          }
          resolve(response.data)
        }).catch(reject)
    })
  }
}

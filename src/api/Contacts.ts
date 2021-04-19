/* eslint-disable */
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { ContactInterface } from './Schemas/ContactInterface'
import { CheckedInterface } from '@/api/Schemas/СheckedInteface'
import ResponseInterface from '@/api/Schemas/ResponseInterface';
import APIError from '@/api/classes/APIError';

interface Contact extends ContactInterface, CheckedInterface {}

export interface ContactResponseInterface {
  count: number;
  items: Contact[];
}

export interface ContactSearchQueryInterface {
  q?: string;
  project_id?: number;
  user_id?: number;
  dates?: string;
  offset?: number;
  count?: number;
}

export interface ContactExportParamsInterface {
  filters: any[],
  format: 'excel' | 'csv',
  target_contacts: number[]
}

export class Contacts {
  /**
   * Find contacts
   *
   * @param params
   */
  public find<TM, TD> (params: any): Promise<ResponseInterface<TM, TD> | any> {
    return new Promise<ResponseInterface<TM, TD> | any>((resolve, reject) => {
      $axios.get('/contacts', {
        params
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data)
        } else {
          reject(response.data)
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
   * @param data
   */
  public update (id: number, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.patch(`/contacts/${id}`, data)
          .then((response: AxiosResponse) => {
            if ([200, 201].includes(response.status)) {
              return resolve(response.data)
            }
            reject(response.statusText)
          }).catch(reject)
    })
  }

  /**
   * Передать контакты по заданным параметрам
   *
   * @param params
   */
  public transfer (params: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.post('/contacts/transfer', params)
          .then((response: AxiosResponse) => {
            if ([200, 204].includes(response.status)) {
              return resolve(response.data)
            }
            throw new APIError(response.data)
          }).catch(reject)
    })
  }

  /**
   *
   * @param id
   */
  public getById (id: number): Promise<ContactInterface> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            resolve(response.data)
            return
          }
          throw new APIError(response.data)
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
  public getByPhoneNumber<T> (number: string): Promise<T> {
    return new Promise<T | any>((resolve, reject) => {
      $axios.get(`/contacts/${number}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * @param id
   */
  public delete (id: number): Promise<unknown> {
    return new Promise<void>((resolve, reject) => {
      $axios.delete(`/contacts/${id}`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve()
          }
          return reject(response)
        }).catch(reject)
    })
  }

  /**
   * Retrieve a contact's call history
   * @param contact_id
   * @param params
   */
  public getHistory<TM, TD> (contact_id: number, params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
      $axios.get(`/contacts/${contact_id}/history`, {
        params
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          return resolve(response.data)
        }
        throw new APIError(response.data)
      }).catch(reject)
    })
  }

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
  public addHistory<DT> (contactId: number, data: DT): Promise<number | any> {
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
  public updateHistory<DT> (historyId: number, data: DT): Promise<any> {
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

  /**
   * Импорт одного или нескольких файлов
   *
   * @param fs
   * @param onUploadProgress
   */
  public import<DT = unknown & {count_insert_contacts: number}> (fs: File | FileList, onUploadProgress?: (event: ProgressEvent) => void): Promise<ResponseInterface<unknown, DT>> {
    return new Promise<ResponseInterface<any, DT>>((resolve, reject) => {

      const upload = (data: any) => {
        $axios.post('/contacts/import', data, {
          onUploadProgress
        }).then((response: AxiosResponse) => {
            if ([200, 201].includes(response.status)) {
              resolve(response.data)
            } else {
              throw new APIError(response.data)
            }
          }).catch(reject)
      }

      if (fs instanceof File) {
        const formData = new FormData()
        formData.append('files', fs)
        upload(formData)
      } else if (fs instanceof FileList) {
        const formData = new FormData()
        Array.from(fs).forEach((file, index) => {
          formData.append(`file[${index}]`, file)
        })
        upload(formData)
      } else {
        throw new Error('Invalid argument')
      }
    })
  }

  /**
   * Экспорт
   *
   * @param params
   */
  public export<DT = string> (params: ContactExportParamsInterface): Promise<DT> {
    return new Promise<DT>((resolve, reject) => {
      $axios.post('/contacts/export', params, {
        responseType: 'blob'
      })
        .then((response: AxiosResponse) => {
        if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;

          if (params.format === 'excel') {
            link.setAttribute('download', `${new Date().getTime()}.xlsx`);
          } else if (params.format === 'csv') {
            link.setAttribute('download', `${new Date().getTime()}.csv`);
          }

          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            link.remove()
          }, 1000)
        } else {
          throw new APIError(response.data)
        }
      }).catch(reject)
    })
  }
}

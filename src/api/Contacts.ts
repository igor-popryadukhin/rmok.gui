import APIError from './classes/APIError'
import Contact from './interfaces/Contact'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { ContactTagInterface } from './Schemas/ContactInterface'
import ContactHistory from '@/api/interfaces/ContactHistory'

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

export interface ContactsParamsFind {
  /**
   * Поиск по совпадению в Имени, Фамилии, Отчестве или Заметках контактов.
   * ----------------------------------------------------------------------
   *
   * Строка.
   */
  q?: string;
  /**
   * Идентификатор проекта.
   * ----------------------
   * Положительное число.
   */
  project_id?: number;
  /**
   * Список дополнительных полей, которые необходимо вернуть.
   * --------------------------------------------------------
   * Доступные значения: responsible, organization, project, tags
   *
   * Список слов, разделенных через запятую.
   */
  fields?: string;
  /**
   * Идентификатор ответственного.
   * -----------------------------
   * Положительное число.
   */
  responsible_id?: number;
  /**
   * Идентификатор группы.
   * -----------------------------
   * Положительное число.
   */
  user_group_id?: number;
  /**
   * Дата создания в формате **unixtime.**
   *
   * ```js
   * const unixtime = new Date().getTime() / 1000
   * ```
   */
  contact_created_at?: number;
  /**
   * Дата последнего звонка в формате **unixtime.**
   *
   * ```js
   * const unixtime = new Date().getTime() / 1000
   * ```
   */
  last_call_at?: number;
  /**
   * Перечисленные через запятую идентификаторы тегов.
   *
   * Количество элементов должно составлять не более 1000
   */
  tag_ids?: string;
  /**
   * Факт наличия или отсутствия задач
   *
   * - available — Вернёт контакты с наличием задач.
   * - unavailable — Вернёт контакты без задач.
   * - overdue — Вернёт контакты с просроченными задачами.
   * - not_overdue — Вернёт контакты с не просроченными задачами.
   *
   * Отсутствие параметра вернёт и те и другие контакты.
   */
  task?: 'available' | 'unavailable' | 'overdue' | 'not_overdue';

  /**
   * 0  - Вернёт все контакты, которым не звонили.
   * 1  - Вернёт все контакты, которым позвонили.
   */
  call_up?: 0 | 1;
  /**
   * Количество возвращаемых контактов.
   *
   * Обратите внимание — даже при использовании параметра offset для получения информации доступны
   * только первые 1000 результатов.
   *
   * Положительное число
   */
  count?: number;
  /**
   * Смещение относительно первого найденного контакта для выборки определенного подмножества.
   * Положительное число, по умолчанию 50, максимальное значение 1000
   */
  offset?: number;
  /**
   * Перечисленные через запятую идентификаторы статусов.
   */
  status_ids?: string;

  /**
   * - 0 - Не используется (по умолчанию).
   * - 1 - Вернёт только новые контакты.
   */
  only_new?: 0 | 1

  /**
   * - 0 - Не используется (по умолчанию).
   * - 1 - Очередь лидов (контакты).
   */
  queue?: 0 | 1
}

/**
 * Параметры для поиска тегов
 */
export interface ContactsParamsGetTags {
  /** Перечисленные через запятую идентификаторы тегов. Имеет приоритет над всеми остальными параметрами. */
  tag_ids?: string;
  /** Поиск по совпадению в имени тега. */
  q?: string;
  /** Смещение относительно первого найденного тега для выборки определенного подмножества. */
  offset?: number;
  /** Количество возвращаемых контактов. */
  count?: number;
}

export class Contacts {
  /**
   * Find contacts
   *
   * @param params
   */
  public find (params: ContactsParamsFind = {}): Promise<ResponseInterface<{ count: number }, Contact[]>> {
    return new Promise((resolve, reject) => {
      $axios.get('/contacts', {
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
          if ([200, 204].includes(response.status)) {
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
  public transfer (params = {}): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.post('/contacts/transfer', params)
        .then((response: AxiosResponse) => {
          if (![200, 202].includes(response.status)) {
            throw new APIError(response.data)
          }
          resolve()
        }).catch(reject)
    })
  }

  /**
   *
   * @param id
   */
  public getById (id: number): Promise<Contact> {
    return new Promise<Contact>((resolve, reject) => {
      $axios.get(`/contacts/${id}`)
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
   * Получить информацию о контакте по номеру телефона.
   *
   * @param number
   */
  public getByPhoneNumber (number: string): Promise<Contact> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/by-number/${number}`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }
          resolve(response.data)
        }).catch(reject)
    })
  }

  /**
   * Удаляет контакты.
   * @param params
   */
  public delete (params = {}): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.delete('/contacts', {
        params
      }).then((response: AxiosResponse) => {
        if (response.status !== 202) {
          throw new APIError(response.data)
        }
        return resolve()
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
   * Вернёт историю контакта по идентификатору истории.
   * @param historyId
   */
  public getHistoryById (historyId: number): Promise<ContactHistory> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/history/${historyId}`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
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
  public addHistory (contactId: number, data: any): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post(`/contacts/${contactId}/history`, data)
        .then((response: AxiosResponse) => {
          if (![200, 201].includes(response.status)) {
            throw new APIError(response.data)
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
  public editHistory (historyId: number, data = {}): Promise<number> {
    return new Promise((resolve, reject) => {
      $axios.patch(`/contacts/history/${historyId}`, data)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }
          resolve(response.data?.id)
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
  public import<DT = unknown & { count_insert_contacts: number }> (fs: File | FileList, onUploadProgress?: (event: ProgressEvent) => void): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const upload = (data: any) => {
        $axios.post('/contacts/import', data, {
          onUploadProgress
        }).then((response: AxiosResponse) => {
          if ([200, 202].includes(response.status)) {
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
   * Экспорт контактов
   *
   * @param params
   */
  public export (params: Record<string, unknown>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.post('/contacts/export', params)
        .then((response: AxiosResponse) => {
          if (response.status !== 202) {
            throw new APIError(response?.data)
          }
          resolve(response.data)
        }).catch(reject)
    })
  }

  /**
   * Вернёт список тегов
   *
   * @param params
   */
  public getTags<TM = unknown & { count: number }, TD = ContactTagInterface[]> (params?: ContactsParamsGetTags): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
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
   * Назначение тегов контактам.
   *
   * @param params
   */
  public setTags (params: Record<string, unknown> = {}): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.post('/contacts/tags/set', params)
        .then((response: AxiosResponse) => {
          if (![200, 202].includes(response.status)) {
            throw new APIError(response?.data)
          }
          resolve()
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

  /**
   * Скачиваем файл экселя с контактами
   *
   * @param name
   */
  public contactDownload (name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.get(`/contacts/export/file/${name}`, { responseType: 'blob' })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            const extFile = name.split('.').pop()
            if (extFile === 'xlsx') {
              link.setAttribute('download', `${new Date().getTime()}.xlsx`)
            } else if (extFile === 'csv') {
              link.setAttribute('download', `${new Date().getTime()}.csv`)
            }

            document.body.appendChild(link)
            link.click()
            setTimeout(() => {
              link.remove()
            }, 1000)
          } else {
            throw new APIError(response.data)
          }
          resolve(response.data?.id)
        }).catch(reject)
    })
  }

  /**
   * Закроет все задачи контакта.
   *
   * @param contact_id
   */
  public closeAllTasks (contact_id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.get(`/contacts/${contact_id}/tasks/close-all`)
        .then((response: AxiosResponse) => {
          if (![202, 200].includes(response.status)) {
            throw new APIError(response.data)
          }
          resolve()
        }).catch(reject)
    })
  }
}

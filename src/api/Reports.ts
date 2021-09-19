import APIError from '@/api/classes/APIError'
import { AxiosResponse } from 'axios'
import { Report } from './interfaces/Report'
import { $axios } from '@/plugins/axios'
import ResponseInterface from '@/api/Schemas/ResponseInterface'

type ReportType = 'recent_calls' | 'all_calls'

/**
 * Отчёты
 */
export default class Reports {
  /**
   * Вернуть список отчётов
   * @param type
   * @param params
   */
  public get (type: ReportType, params = {}): Promise<ResponseInterface<{ number_new_reports: number }, Report[]>> {
    return new Promise((resolve, reject) => {
      $axios.get(`/reports/${type}`, {
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
   * Создаёт новый отчёт
   *
   * @param type
   * @param params
   */
  public make (type: ReportType, params = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.post(`/reports/${type}`, params)
        .then((response: AxiosResponse) => {
          if (response.status !== 202) {
            throw new APIError(response.data)
          }
          resolve(response.data)
        }).catch(reject)
    })
  }

  /**
   * Удаляет отчёт, используя идентификатор.
   * @param id
   */
  public delete (id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      $axios.delete(`/reports/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }
          resolve()
        }).catch(reject)
    })
  }

  /**
   * Скачать файл отчёта.
   *
   * @param id
   */
  public download (id: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      $axios.get(`/reports/${id}/download`, { responseType: 'blob' })
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          const type = response.headers['content-type']

          const a = document.createElement('a')
          document.body.appendChild(a)
          a.setAttribute('style', 'display: none')
          const url = window.URL.createObjectURL(new Blob([response.data], { type }))
          a.href = url
          a.click()
          setTimeout(() => {
            a.remove()
          }, 1000)

          window.URL.revokeObjectURL(url)
        }).catch(reject)
    })
  }
}

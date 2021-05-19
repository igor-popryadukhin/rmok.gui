import APIError from '@/api/classes/APIError'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface StatusGroupInterface {
  id: number;
  name: string;
}

export interface StatusInterface {
  id: number;
  name: string;
  color: string;
  group?: StatusGroupInterface;
  statuses?: unknown & {
    id: number;
    name: string;
  };
}

export default class Statuses {
  /**
   * Поиск статусов
   *
   * @param params
   */
  public findBy<TM = null, TD = StatusInterface[]> (params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
      $axios.get('/statuses', {
        params
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          resolve(response.data)
        }
        throw new APIError(response.data)
      }).catch(reject)
    })
  }

  /**
   * Получить статус по идентификатору
   *
   * @param id
   */
  public findById<StatusInterface> (id: number): Promise<StatusInterface> {
    return new Promise<StatusInterface>((resolve, reject) => {
      $axios
        .get(`/statuses/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }
}

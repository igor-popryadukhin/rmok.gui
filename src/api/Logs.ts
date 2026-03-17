import { $axios } from '@/plugins/axios';
import { AxiosResponse } from 'axios';
import ResponseInterface from '@/api/Schemas/ResponseInterface';
import APIError from './classes/APIError';
import { UserInterface } from '@/api/Users';

export interface LogInterface {
  id: number;
  action: string;
  context: [] | null;
  controller: string;
  http_method: string;
  ip: string;
  is_archive: boolean;
  query_string: string | null;
  request: [] | null;
  start_action_at: number;
  url: string;
  user: UserInterface[];
  user_agent: string;
}

export default class Logs {
  /**
   * @param params
   */
  public find<TM, TD = LogInterface[]> (params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve: (response: ResponseInterface<TM, TD>) => void, reject) => {
      $axios.get('/logs', {
        params
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          return resolve(response.data);
        }
        throw new APIError(response.data);
      }).catch(reject);
    });
  }

  /**
   * Получить детализацию лога по идентификатору
   * @param id
   */
  public getById (id: number): Promise<LogInterface> {
    return new Promise<LogInterface>((resolve, reject) => {
      $axios.get(`/logs/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data);
          }
          reject(response.data);
        }).catch(reject);
    });
  }

  /**
   * Получаем действия логов
   */
  public getActionsLog<TM, TD> (): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve, reject) => {
      $axios.get('/logs/actions')
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            resolve(response.data);
          }
        }).catch(reject);
    });
  }
}

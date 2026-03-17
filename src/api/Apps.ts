import { $axios } from '@/plugins/axios';
import { AxiosResponse } from 'axios';

interface AppsCreateInterface {
  name: string;
  organization_id: number;
}

export interface AppInterface {
  id: number;
  name: string;
  client_id: string;
  created_at: number;
}

export interface AppsResponseItemsInterface {
  count: number;
  items: AppInterface[];
}

export default class Apps {
  /**
   * Получить список приложений
   * @param organization_id
   * @param offset
   * @param count
   */
  public get (organization_id: number, offset = 0, count = 0): Promise<any> {
    return new Promise<AppsResponseItemsInterface[]>((resolve, reject): Promise<any> | any => {
      const params: any = {};
      if (organization_id > 0) { params.organization_id = organization_id; }
      if (offset > 0) { params.offset = offset; }
      if (count > 0) { params.count = count; }
      $axios.get('/apps', {
        params: {
          ...params
        }
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          return resolve(response.data);
        }
        reject(response.data);
      }).catch(reject);
    });
  }

  /**
   * Получить данные приложения по идентификатору
   * @param app_id
   */
  public getById (app_id: number): Promise<AppInterface> | any {
    return new Promise<AppInterface>((resolve, reject) => {
      $axios.get(`/apps/${app_id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data);
          }
          reject(response.data);
        }).catch(reject);
    });
  }

  /**
   * Создать новое приложение
   * @param data
   */
  public create (data: AppsCreateInterface): Promise<any> {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.post('/apps', data)
        .then((response: AxiosResponse) => {
          if (response.status === 201) {
            return resolve(response.data);
          }
          reject(response.data);
        }).catch(reject);
    });
  }
}

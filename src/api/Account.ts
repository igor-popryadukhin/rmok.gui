import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface ProfileInterface {
  /* eslint-disable */
  id: number;
  login: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  userpic: null;
  created_at: number;
  role: Role;
  /* eslint-enable */
}

export interface Role {
  id: string;
  name: string;
  attributes: string[];
}

export class Account {
  public getProfile (): Promise<ProfileInterface> {
    return new Promise((resolve, reject): Promise<ProfileInterface> | any => {
      $axios.get('/account/profile')
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data as ProfileInterface)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  public isRole (role: string): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.get(`/account/roles/is/${role}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data.result)
          }
          resolve(false)
        }).catch(reject)
    })
  }
}

import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { OrganizationInterface } from '@/api/Organizations'
import { PermissionGroupInterface } from '@/api/Permissions'

export enum UserStatus {
  AVAILABLE = 'available',
  DO_NOT_DISTURB = 'do_not_disturb',
  COFFEE_BREAK = 'coffee_break'
}
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
  status: string;
  created_at: number;
  role: Role;
  is_super_admin?: Boolean;
  permissions: PermissionGroupInterface[];
  organization?: OrganizationInterface;
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

  /**
   * Update profile details
   */
  public updateProfile (data: any): Promise<any> {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.patch('/account/profile', data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
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

  /**
   * Установить статус пользователю
   *
   * @param status
   */
  public setStatus (status: UserStatus): Promise<any> {
    return new Promise((resolve, reject) => {
      $axios.get(`/account/status/${status}`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          throw new Error(response.data)
        }).catch(reject)
    })
  }
}

export default Account

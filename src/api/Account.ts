import APIError from '@/api/classes/APIError'
import User from '@/api/interfaces/User'
import Country from '@/api/Schemas/Country'
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
  roles: string[];
  role: Role;
  is_super_admin?: boolean;
  tz?: boolean;
  permissions: PermissionGroupInterface[];
  organization?: OrganizationInterface;
  country?: Country;
  /* eslint-enable */
}

export interface Role {
  id: string;
  name: string;
  attributes: string[];
}

export class Account {
  /**
   * Редактирует информацию текущего профиля.
   */
  public updateProfile (data: Record<string, unknown>): Promise<any> {
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
}

export default Account

/* eslint-disable */
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import AccessTokenInterface from '@/api/Schemas/AccessTokenInterface'
import ResponseInterface from '@/api/Schemas/ResponseInterface';

interface OrganizationPhoneValueInterface {
  e164: string;
  international: string;
}

export interface OrganizationPhoneInterface {
  id?: number;
  country_code: string;
  country_calling_code: string;
  label: string;
  value: OrganizationPhoneValueInterface | string;
}

export interface OrganizationEmailInterface {
  id?: number;
  label: string;
  value: string;
}

export interface OrganizationInterface {
  id: number;
  name: string;
  sphere_activity?: string;
  inn?: string;
  cpp?: string;
  site?: string;
  city?: string;
  address?: string;
  region?: string;
  description?: string;
  phone?: string;
  email?: string
  responsible: Responsible;
  tags?: OrganizationTagInterface[] | null;
  app?: OrganizationAppInterface;
}

export interface Responsible {
  id: number;
  first_name: string;
  last_name: string;
}

export interface OrganizationTagInterface {
  id: number;
  name: string;
}

export interface OrganizationAppInterface {
  id: number;
  name: string;
  client_id: string;
  client_secret: string;
  created_at: number;
}

export class Organizations {
  /**
   *
   * @param params
   */
  public find (params: any) {
    return new Promise<ResponseInterface<any, OrganizationInterface[]>>((resolve, reject) => {
      $axios.get('/organizations', {
        params
      }).then((response: AxiosResponse) => {
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
  public getById (id: number): Promise<OrganizationInterface> {
    return new Promise((resolve, reject): Promise<OrganizationInterface> | any => {
      $axios.get(`/organizations/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Получить мою организацию
   */
  public getMy (): Promise<OrganizationInterface> {
    return new Promise<OrganizationInterface | any>((resolve, reject): Promise<OrganizationInterface> | any => {
      $axios.get('/organizations/my')
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Получить мою организацию
   */
  public generatePersonalAccessToken (): Promise<AccessTokenInterface> {
    return new Promise<AccessTokenInterface | any>((resolve, reject): Promise<AccessTokenInterface> | any => {
      $axios.get('/organizations/access-token/generate')
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Add new organization
   * @param data
   */
  public add (data: any): Promise<any> {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.post('/organizations', data)
        .then((response: AxiosResponse) => {
          if (response.status === 201) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * @param id
   * @param data
   */
  public update (id: number, data: any): Promise<any> {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.put(`/organizations/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            resolve(response.data)
          } else {
            reject(response.data)
          }
        }).catch(reject)
    })
  }

  /**
   * Deletes an organization
   * @param id
   */
  public delete (id: number): Promise<any> {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.delete(`/organizations/${id}`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve()
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Get a list of tags
   */
  public getTags (): Promise<OrganizationTagInterface[] | any> {
    return new Promise((resolve, reject): Promise<OrganizationTagInterface[] | any> | any => {
      $axios.get('/organizations/tags')
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data as OrganizationTagInterface[])
          }
          reject(response.data)
        }).catch(reject)
    })
  }
}

export default Organizations

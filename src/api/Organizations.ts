import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface OrganizationPhoneInterface {
  id: number;
  country_code: string;
  country_calling_code: string;
  label: string;
  value: string;
}

export interface OrganizationEmailInterface {
  label: string;
  value: string;
}

export interface OrganizationInterface {
  id: number;
  name: string;
  sphere_activity: string;
  inn: string;
  cpp: string;
  site: string;
  phones?: OrganizationPhoneInterface[] | null;
  emails?: OrganizationEmailInterface[] | null;
  responsible: Responsible;
  tags?: OrganizationTagInterface[] | null;
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

export class Organizations {
  /**
   *
   * @param q
   * @param tags
   * @param offset
   * @param count
   */
  public find (q = '', tags: string[] = [], offset = 0, count = 100): Promise<any> {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.get('/organizations', {
        params: {
          q,
          offset,
          count,
          tags
        }
      })
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
            return resolve(response.data)
          }
          reject(response.data)
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

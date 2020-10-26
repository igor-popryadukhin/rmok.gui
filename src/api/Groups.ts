import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface GroupTeamLeaderInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface GroupOrganizationInterface {
  id: number;
  name: string;
}

export interface GroupInterface {
  id: number;
  name: string;
  team_leader?: GroupTeamLeaderInterface;
  organization?: GroupOrganizationInterface;
}

export class Groups {
  /**
   * Поиск групп
   * @param q
   * @param offset
   * @param count
   */
  public find (q = '', offset = 0, count = 100): Promise<GroupInterface[] | any> | any {
    return new Promise((resolve, reject): Promise<GroupInterface[] | any> | any => {
      $axios.get('/groups', { params: { q, offset, count } })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          resolve(false)
        }).catch(reject)
    })
  }

  /**
   * Add a new group to the server
   * @param data
   */
  public add (data: any): Promise<any> {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.post('/groups', data)
        .then((response: AxiosResponse) => {
          if (response.status === 201) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Update group
   * @param id
   * @param data
   */
  public update (id: number, data: any): Promise<any> | any {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.put(`/groups/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Delete group
   * @param id
   */
  public delete (id: number): Promise<any> | any {
    return new Promise((resolve, reject): Promise<any> | any => {
      $axios.get(`/groups/${id}`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  public getById (id: number): Promise<GroupInterface> {
    return new Promise((resolve, reject): Promise<GroupInterface> | any => {
      $axios.get(`/groups/${id}`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }
}

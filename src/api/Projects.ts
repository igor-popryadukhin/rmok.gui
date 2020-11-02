import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface ProjectOwnerInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface ProjectInterface {
  id: string;
  name: string;
  comment: string;
  owner: ProjectOwnerInterface;
  organization: ProjectOwnerInterface;
  created_at: number;
}

export interface ProjectResponseItemsInterface {
  count: number;
  items: ProjectInterface[];
}

export class Projects {
  /**
   * @param q
   * @param offset
   * @param count
   */
  public find (q = '', offset = 0, count = 100): Promise<ProjectResponseItemsInterface> {
    return new Promise<ProjectResponseItemsInterface>((resolve, reject) => {
      $axios.get('/projects', {
        params: {
          q, offset, count
        }
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          return resolve(response.data as ProjectResponseItemsInterface)
        }
        reject(response.data)
      }).catch(reject)
    })
  }

  public getById (id: string): Promise<ProjectInterface | any> | any {
    return new Promise((resolve, reject): Promise<ProjectInterface | any> | any => {
      $axios.get(`/roles/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data.result)
          }
          resolve(false)
        }).catch(reject)
    })
  }
}

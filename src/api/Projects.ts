import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface ProjectOwnerInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface ProjectInterface {
  id: number;
  name: string;
  comment: string;
  owner: ProjectOwnerInterface;
  organization: ProjectOwnerInterface;
  statuses: StatusInterface[];
  created_at: number;
}

export interface StatusInterface {
  id: number;
  name: number;
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

  /**
   * Get current user project.
   */
  public current (): Promise<ProjectInterface | any> | any {
    return new Promise((resolve, reject): Promise<ProjectInterface | any> | any => {
      $axios.get('/projects/current')
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }
}

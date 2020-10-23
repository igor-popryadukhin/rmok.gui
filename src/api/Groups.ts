import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

export interface GroupInterface {
  id: string;
  name: string;
}

export class Groups {
  public get (): Promise<GroupInterface[] | any> | any {
    return new Promise((resolve, reject): Promise<GroupInterface[] | any> | any => {
      $axios.get('/groups')
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          resolve(false)
        }).catch(reject)
    })
  }

  public getById (id: string): Promise<GroupInterface | any> | any {
    return new Promise((resolve, reject): Promise<GroupInterface | any> | any => {
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

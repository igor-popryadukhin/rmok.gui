/* eslint-disable */
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { ContactInterface } from '@/api/Schemas/ContactInterface'

export enum TaskType {
  CALL = 'call',
  TASK = 'task',
  MEETING = 'meeting',
  LETTER = 'letter',
  OTHER = 'other'
}

export interface TaskInterface {
  id: number;
  user: TaskUserInterface;
  type: string;
  description: string;
  done: boolean;
  planned_for: number;
  author: TaskAuthorInterface;
  contact?: ContactInterface;
  created_at: number;
}

interface TaskUserInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

interface TaskAuthorInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface TaskPostDataInterface {
  planned_for: number;
  description: string;
  contact_id?: number;
  type: string;
}

export interface TaskGetResponseInterface {
  count: number;
  items: TaskInterface[];
}

interface TaskGetParamsInterface {
  q?: string;
  contact_id?: number;
  user_id?: number;
  offset?: number;
  count?: number;
}

export default class Tasks {

  /**
   * @param params
   */
  public get (params: TaskGetParamsInterface = {}): Promise<TaskGetResponseInterface> | any {
    return new Promise((resolve, reject) => {
      $axios.get('/tasks', {
        params: {
          ...params
        }
      }).then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * @param data
   */
  public add (data: TaskPostDataInterface): Promise<any> | any {
    return new Promise((resolve, reject) => {
      $axios.post('/tasks', data)
        .then((response: AxiosResponse) => {
          if ([201, 200].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * @param taskId
   */
  public done (taskId: number): Promise<any> | any {
    return new Promise((resolve, reject) => {
      $axios.get(`/tasks/${taskId}/done`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * @param taskId
   */
  public notDone (taskId: number): Promise<any> | any {
    return new Promise((resolve, reject) => {
      $axios.get(`/tasks/${taskId}/not-done`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }
}

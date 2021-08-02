/* eslint-disable */
import Task from './interfaces/Task';
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import APIError from '@/api/classes/APIError'
import ResponseInterface from '@/api/Schemas/ResponseInterface'

export enum TaskType {
  CALL = 'call',
  TASK = 'task',
  MEETING = 'meeting',
  LETTER = 'letter',
  OTHER = 'other'
}

interface PerformerInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface TaskInterface {
  id: number;
  performer: PerformerInterface;
  type: string;
  description: string;
  state: 'done' | 'pending';
  expired: boolean;
  planned_for: number;
  author: TaskAuthorInterface;
  contact?: ContactInterface;
  created_at: number;
}

interface TaskAuthorInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface TaskGetResponseInterface {
  count: number;
  items: TaskInterface[];
}

export default class Tasks {

  /**
   * Осуществляет поиск задач по заданным параметрам.
   *
   * @param params
   */
  public find (params= {}): Promise<ResponseInterface<any, Task[]>> {
    return new Promise<ResponseInterface<any, Task[]>>((resolve, reject) => {
      $axios.get('/tasks', {
        params
      }).then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Получить количество
   *
   * @param params
   */
  public count<T = unknown & { count: number }> (params = {} as { planned_for?: string; state: 'pending' | 'done' }): Promise<ResponseInterface<null, T>> {
    return new Promise<ResponseInterface<null, T>>((resolve, reject) => {
      $axios.get('/tasks/count', {
        params
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          return resolve(response.data)
        }
        throw new APIError(response.data)
      }).catch(reject)
    })
  }

  /**
   * Возвращает количество открытых задач текущего пользователя.
   */
  public countPending (): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.get('/tasks/count/pending')
        .then((response: AxiosResponse) => {
        if (response.status === 200) {
          return resolve(+response.data.count)
        }
        throw new APIError(response.data)
      }).catch(reject)
    })
  }

  /**
   * @param data
   */
  public add<T> (data: T): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post('/tasks', data)
        .then((response: AxiosResponse) => {
          if ([201, 200].includes(response.status)) {
            return resolve(response.data.id)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Редактирует задачу
   *
   * @param id
   * @param data
   */
  public edit<T = any> (id: number | string, data: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.patch(`/tasks/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([204, 200].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Удалить задачу используя идентификатор
   *
   * @param id
   */
  public delete (id: number | string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.delete(`/tasks/${id}`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Возвращает информацию о задачах по их идентификаторам.
   *
   * @param id
   */
  public getById<T = TaskInterface> (id: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      $axios.get(`/tasks/${id}`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Установит статус задачи.
   *
   * @param taskId Идентификатор задачи.
   * @param state Состояние задачи, одно из возможных вариантов `done | pending`.
   */
  public setState (taskId: number, state: 'done' | 'pending'): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.get(`/tasks/${taskId}/${state}`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }
}

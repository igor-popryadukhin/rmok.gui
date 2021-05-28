import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import APIError from './classes/APIError'
import { GroupInterface } from '@/api/Groups'

export interface ProjectOwnerInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface ProjectOrganizationInterface {
  id: number;
  name: string;
}

export interface ProjectMemberInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
}

export interface StatusInterface {
  id: number;
  name: number;
}

export interface ProjectInterface {
  id: number;
  name: string;
  description: string;
  owner?: ProjectOwnerInterface;
  organization?: ProjectOrganizationInterface;
  members: ProjectMemberInterface[];
  statuses?: StatusInterface[];
  users_groups?: GroupInterface[];
  scenario?: string;
  created_at: number;
}

export interface ProjectResponseItemsInterface {
  count: number;
  items: ProjectInterface[];
}

export default class Projects {
  /**
   * @param params
   */
  public find<TM, TD = ProjectInterface[]> (params = {}): Promise<ResponseInterface<TM, TD>> {
    return new Promise<ResponseInterface<TM, TD>>((resolve: (response: ResponseInterface<TM, TD>) => void, reject) => {
      $axios.get('/projects', {
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
   * Add new project
   * @param data
   */
  public add<DT = any, RT = any> (data: DT): Promise<APIError | RT> {
    return new Promise<APIError | RT>((resolve, reject) => {
      $axios.post('/projects', data)
        .then((response: AxiosResponse) => {
          if ([200, 201].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Вернёт текущий проект пользователя если таковой имеется, в противном случае будет брошено исключение.
   */
  public current (): Promise<ProjectInterface> {
    return new Promise<ProjectInterface>((resolve, reject) => {
      $axios.get('/projects/current')
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Add new project
   * @param id
   * @param data
   */
  public update<DT = any> (id: number, data: DT): Promise<ProjectResponseItemsInterface> {
    return new Promise<ProjectResponseItemsInterface>((resolve, reject) => {
      $axios.put(`/projects/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Установить текущий проект пользователю.
   * @param id Идентификатор проекта
   */
  public active (id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.get(`/projects/${id}/activate`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Покинуть текущий проект.
   */
  public inactive (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.get('/projects/inactive')
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Получить проект по идентификатору
   * @param id
   */
  public getById (id: number): Promise<ProjectInterface> {
    return new Promise<ProjectInterface>((resolve, reject) => {
      $axios.get(`/projects/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          reject(response.data)
        }).catch(reject)
    })
  }

  /**
   * Получить текущий пользовательский проект по идентификатору пользователя
   * @param user_id
   */
  public getCurrentUserProjectByUserId (user_id: number): Promise<ProjectInterface> {
    return new Promise<ProjectInterface>((resolve, reject) => {
      $axios.get(`/projects/user/${user_id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Удалить проект используя идентификатор проекта
   * @param id
   */
  public delete (id: number): Promise<boolean | APIError> {
    return new Promise<boolean | APIError>((resolve, reject) => {
      $axios.delete(`/projects/${id}`)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(true)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }
}

import Status from '@/api/Schemas/Status'
import StatusGroup from '@/api/Schemas/StatusGroup'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import APIError from './classes/APIError'
import { GroupInterface } from '@/api/Groups'
import Project from '@/api/interfaces/Project'

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

export default class Projects {
  /**
   * @param params
   */
  public find (params = {}): Promise<ResponseInterface<{ count: number }, Project[]>> {
    return new Promise((resolve, reject) => {
      $axios.get('/projects', {
        params
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        return resolve(response.data)
      }).catch(reject)
    })
  }

  /**
   * Создаёт новый проект.
   *
   * @param data
   */
  public create (data: { name: string }): Promise<{ id: number }> {
    return new Promise<{ id: number }>((resolve, reject) => {
      $axios.post('/projects', data)
        .then((response: AxiosResponse) => {
          if (response.status === 201) {
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
   * Редактирует параметры проекта.
   *
   * @param id идентификатор проекта.
   * @param data
   */
  public edit (id: number, data: { name?: string; scenario?: string; }): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.patch(`/projects/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Добавить участников в проект.
   *
   * @param id Идентификатор проекта.
   * @param number_ids Массив идентификаторов пользователей.
   */
  public addMembers (id: number, number_ids: number[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.post(`/projects/${id}/members`, number_ids)
        .then((response: AxiosResponse) => {
          if ([200, 204].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Удалить участников из проекта.
   *
   * @param id Идентификатор проекта.
   * @param member_ids
   */
  public deleteMembers (id: number, member_ids: number[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (member_ids.length === 1) {
        // Если нужно удалить одного.
        $axios.delete(`/projects/${id}/members/${member_ids[0]}`)
          .then((response: AxiosResponse) => {
            if (response.status === 200) {
              return resolve()
            }
            throw new APIError(response.data)
          }).catch(reject)
      } else {
        // Если нужно удалить одного и более.
        $axios.delete(`/projects/${id}/members`, {
          params: {
            member_ids
          }
        }).then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
      }
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
   * Вернёт список участников проекта.
   *
   * @param id Идентификатор проекта.
   * @param offset Смещение для выборки подмножеств.
   * @param count Количество возвращаемых элементов.
   */
  public getMembers (id: number, offset = 0, count = 50): Promise<ResponseInterface<any, any>> {
    return new Promise<ResponseInterface<any, any>>((resolve, reject) => {
      $axios.get(`/projects/${id}/members`, {
        params: {
          offset,
          count
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
   * Вернёт все статусы проекта.
   *
   * @param project_id
   */
  public getStatuses (project_id: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $axios.get(`/projects/${project_id}/statuses`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Возвращает статус по идентификатору.
   *
   * @param id идентификатор статуса
   */
  public getStatusById (id: number): Promise<Status> {
    return new Promise<Status>((resolve, reject) => {
      $axios.get(`/projects/statuses/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Добавить статус в проект.
   *
   * @param data данные нового статуса.
   */
  public addStatus (data: { project_id: number; group_id: number; name: string; actions: any[] }): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post('/projects/statuses', data)
        .then((response: AxiosResponse) => {
          if (response.status === 201) {
            return resolve(response.data?.id)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Редактирует статус.
   *
   * @param id идентификатор статуса
   * @param data данные для редактирования.
   */
  public editStatus (id: number, data: { name: string; actions: any[]}): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.put(`/projects/statuses/${id}`, data)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Удаляет статус.
   *
   * @param id идентификатор статуса
   */
  public deleteStatus (id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.delete(`/projects/statuses/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Получить текущий пользовательский проект по идентификатору пользователя.
   *
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

  /**
   * Добавит новый статус в проект
   *
   * @param data
   */
  public addStatusGroup (data: { project_id: number; name: string, color: string }): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      $axios.post('/projects/statuses/groups', data)
        .then((response: AxiosResponse) => {
          if ([201].includes(response.status)) {
            return resolve(response.data?.id)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Редактирует имя и цвет группы статуса.
   *
   * @param id
   * @param data
   */
  public editStatusGroup (id: number, data: { name: string, color: string }): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.put(`/projects/statuses/groups/${id}`, data)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Получить группу статуса по его идентификатору.
   *
   * @param id идентификатор группы статуса.
   */
  public getStatusGroupById (id: number): Promise<StatusGroup> {
    return new Promise<StatusGroup>((resolve, reject) => {
      $axios.get(`/projects/statuses/groups/${id}`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve(response.data)
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }

  /**
   * Удалит группу статуса.
   *
   * @param id
   */
  public deleteStatusGroup (id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.delete(`/projects/statuses/groups/${id}`)
        .then((response: AxiosResponse) => {
          if ([200].includes(response.status)) {
            return resolve()
          }
          throw new APIError(response.data)
        }).catch(reject)
    })
  }
}

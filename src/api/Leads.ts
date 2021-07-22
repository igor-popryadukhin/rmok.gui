/* eslint-disable */
import APIError from '@/api/classes/APIError';
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { ContactInterface } from './Schemas/ContactInterface'
import { CheckedInterface } from '@/api/Schemas/СheckedInteface'
import ResponseInterface from '@/api/Schemas/ResponseInterface';

interface Contact extends ContactInterface, CheckedInterface {}

export interface LeadResponseInterface {
  count: number;
  items: Contact[];
}

export interface LeadSearchQueryInterface {
  q?: string;
  project_id?: number;
  user_id?: number;
  dates?: string;
  offset?: number;
  count?: number;
}

export default class Leads {
  /**
   * Find contacts
   *
   * @param query
   */
  public get<MT, DT> (query: LeadSearchQueryInterface | null = { q: '', offset: 0, count: 100 }) {
    return new Promise<ResponseInterface<MT, DT>>((resolve, reject) => {
      $axios.get('/leads', {
        params: { ...query }
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data)
        }
        throw new APIError(response.data)
      }).catch(reject)
    })
  }

  /**
   * Получить следующего лида
   *
   * @param contact_id
   */
  public next (contact_id: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const params: any = {}
      if (contact_id > 0) {
        params.contact_id = contact_id
      }
      $axios.get('/leads/next', {
        params: { ...params }
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data.contact_id)
        } else {
          reject(response.data)
        }
      }).catch(reject)
    })
  }

  /**
   * Получить очередь Лидов с настраиваемой сортировкой
   *
   * @param query
   */
  public getQueueLeads<MT, DT> (query: LeadSearchQueryInterface | null = { q: '', offset: 0, count: 100 }) {
    return new Promise<ResponseInterface<MT, DT>>((resolve, reject) => {
      $axios.get('/leads/queue', {
        params: { ...query }
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data)
        }
        throw new APIError(response.data)
      }).catch(reject)
    })
  }
}

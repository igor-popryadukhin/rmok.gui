/* eslint-disable */
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import { ContactInterface } from './Schemas/ContactInterface'
import { CheckedInterface } from '@/api/Schemas/СheckedInteface'

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

export class Leads {
  /**
   * Find contacts
   *
   * @param query
   */
  public get (query: LeadSearchQueryInterface | null = { q: '', offset: 0, count: 100 }): Promise<LeadResponseInterface> {
    return new Promise<LeadResponseInterface>((resolve, reject) => {
      $axios.get('/leads', {
        params: { ...query }
      }).then((response: AxiosResponse) => {
        if ([200].includes(response.status)) {
          resolve(response.data)
        } else {
          reject(response.data)
        }
      }).catch(reject)
    })
  }
}

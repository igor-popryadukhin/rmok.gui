import APIError from '@/api/classes/APIError'
import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { ContactsViewState } from './state'
import { AxiosResponse } from 'axios'
import { $axios } from '@/plugins/axios'

const actions: ActionTree<ContactsViewState, RootState> = {
  fetch: ({ commit }, payload) => {
    commit('flush')
    commit('history/flush')

    return new Promise<number>((resolve, reject) => {
      setTimeout(() => (commit('fetching', true)), 0)

      $axios.get(`/contacts/${payload}`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          commit('contact_id', response.data?.id)
          commit('contact_name', response.data?.contact_name)
          commit('contact_tags', response.data?.tags)
          commit('contact_owner_id', response.data?.owner?.id || 0)
          commit('contact_owner_full_name', response.data?.owner?.full_name || '')

          if (response.data?.project?.id) {
            commit('contact_project_id', response.data?.project?.id || 0)
            commit('contact_project_name', response.data?.project?.name || '')
            commit('contact_project_statuses', response.data?.project?.statuses || [])
            commit('contact_project_scenario', response.data?.project?.scenario || '')
          }

          commit('contact_scenario_id', response.data?.scenario?.id || 0)
          commit('contact_scenario_content', response.data?.scenario?.content || '')

          commit('contact_details', response.data?.contact_details || [])
          commit('contact_phones', response.data?.phones || [])
          commit('contact_emails', response.data?.emails || [])
          commit('contact_default_phone_number', response.data?.default_phone?.raw || '')
          commit('contact_city', response.data?.city || '')
          commit('contact_region', response.data?.region || '')
          commit('contact_tz', response.data?.tz || '')
          commit('contact_created_at', response.data?.created_at || '')

          resolve(response.data?.id)
        }).catch(reject).finally(() => (commit('fetching', false)))
    })
  },

  /**
   * @param commit
   * @param payload
   */
  fetch_by_phone_number: ({ commit }, payload) => {
    commit('flush')
    commit('history/flush')

    return new Promise<void>((resolve, reject) => {
      commit('fetching', true)

      $axios.get(`/contacts/${payload}`)
        .then((response) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          commit('contact_id', response.data?.id)
          commit('contact_name', response.data?.contact_name)
          commit('contact_tags', response.data?.tags)
          commit('contact_owner_id', response.data?.owner?.id || 0)
          commit('contact_owner_full_name', response.data?.owner?.full_name || '')

          if (response.data?.project?.id) {
            commit('contact_project_id', response.data?.project?.id || 0)
            commit('contact_project_name', response.data?.project?.name || '')
            commit('contact_project_statuses', response.data?.project?.statuses || [])
            commit('contact_project_scenario', response.data?.project?.scenario || '')
          }

          commit('contact_scenario_id', response.data?.scenario?.id || 0)
          commit('contact_scenario_content', response.data?.scenario?.content || '')

          commit('contact_phones', response.data?.phones || [])
          commit('contact_emails', response.data?.emails || [])
          commit('contact_default_phone_number', response.data?.default_phone?.raw || '')
          commit('contact_city', response.data?.city || '')
          commit('contact_region', response.data?.region || '')
          commit('contact_tz', response.data?.tz || '')
          commit('contact_created_at', response.data?.created_at || '')

          resolve()
        }).catch(reject)
        .finally(() => (commit('fetching', false)))
    })
  },

  flush: ({ commit }) => {
    commit('flush')
  }
}

export default actions

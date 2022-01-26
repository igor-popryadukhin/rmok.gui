import APIError from '@/api/classes/APIError'
import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { ContactsIncomingState } from './state'
import { $axios } from '@/plugins/axios'

const actions: ActionTree<ContactsIncomingState, RootState> = {
  /**
   * @param commit
   * @param payload
   */
  fetch_by_phone_number: ({ commit }, payload) => {
    commit('flush')

    return new Promise<void>((resolve, reject) => {
      commit('fetching', true)

      $axios.get(`/contacts/by-number/${payload}`)
        .then((response) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          commit('contact_id', response.data?.id)
          commit('contact_name', response.data?.contact_name)

          commit('contact_city', response.data?.city || '')
          commit('contact_region', response.data?.region || '')
          commit('contact_tz', response.data?.tz || '')
          commit('contact_created_at', response.data?.created_at || '')

          setTimeout(() => (resolve()), 0)
        }).catch(reject)
        .finally(() => (commit('fetching', false)))
    })
  },

  flush: ({ commit }) => {
    commit('flush')
  }
}

export default actions

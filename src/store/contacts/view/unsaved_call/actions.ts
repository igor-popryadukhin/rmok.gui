import APIError from '@/api/classes/APIError'
import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionTree } from 'vuex'
import { UnsavedCallState } from './state'

const actions: ActionTree<UnsavedCallState, RootState> = {
  save ({ commit, state, dispatch }) {
    commit('persists', true)

    return new Promise<void>((resolve) => {
      $axios.patch(`/contacts/history/${state.data_contact_history_id}`, {
        comment: state.data_comment,
        status_id: state.data_status_id
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        dispatch('flush')
        resolve()
      }).finally(() => (commit('persists', false)))
    })
  },

  flush ({ commit }) { commit('flush') }
}

export default actions

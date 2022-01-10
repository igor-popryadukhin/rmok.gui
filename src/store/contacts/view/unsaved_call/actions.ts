import APIError from '@/api/classes/APIError'
import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionTree } from 'vuex'
import { UnsavedCallState } from './state'

const actions: ActionTree<UnsavedCallState, RootState> = {
  save ({ commit, state }) {
    commit('persists', true)
    return new Promise<void>((resolve) => {
      $axios.patch(`/contacts/history/${state.data_contact_history_id}`, {
        comment: state.data_comment,
        status_id: state.data_status_id
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        commit('unsaved', false)

        commit('data_contact_history_id', 0)
        commit('data_contact_id', 0)
        commit('data_contact_name', '')
        commit('data_call_id', null)
        commit('data_status_id', 0)
        commit('data_comment', '')

        resolve()
      }).finally(() => (commit('persists', false)))
    })
  }
}

export default actions

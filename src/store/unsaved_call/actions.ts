import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import { Contacts } from '@/api/Contacts'

const actions: ActionTree<State, RootState> = {
  save ({ commit, rootGetters }) {
    return new Promise<void>((resolve) => {
      new Contacts()
        .editHistory(rootGetters['unsaved_call/data/contact_history_id'], {
          comment: rootGetters['unsaved_call/data/comment'],
          status_id: rootGetters['unsaved_call/data/status_id']
        }).then(() => {
          commit('unsaved', false)

          commit('data/contact_history_id', 0)
          commit('data/contact_id', 0)
          commit('data/contact_name', '')
          commit('data/call_id', null)
          commit('data/status_id', 0)
          commit('data/comment', '')

          resolve()
        })
    })
  }
}

export default actions

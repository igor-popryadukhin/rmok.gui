import Statuses from '@/api/Statuses'
import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { StatusesState } from './state'

const actions: ActionTree<StatusesState, RootState> = {

  async items ({ commit }, payload = {}) {
    return commit('items', await new Statuses().find(payload))
  }

}

export default actions

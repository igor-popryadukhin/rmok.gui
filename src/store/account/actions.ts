import { RootState } from '@/store'
import { ActionTree, ActionContext } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'

const actions: ActionTree<State, RootState> = {
  busy_state (ctx: ActionContext<State, RootState>, payload) {
    $axios.get(`/account/busy/${payload}`)
  }
}

export default actions

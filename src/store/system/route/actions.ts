import { RootState } from '@/store'
import { State } from './state'
import { ActionContext, ActionTree } from 'vuex'
import router from '@/router'

const actions: ActionTree<State, RootState> = {
  navigate: ({ commit, state }: ActionContext<State, RootState>, payload = null) => {
    if (state.full_path) {
      router.replace(state.full_path)
      commit('full_path', undefined)
    }
  }
}

export default actions

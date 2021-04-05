import Tasks from '@/api/Tasks'
import { RootStateInterface } from '@/store/index'
import { ActionContext } from 'vuex'

interface StateInterface {
  pending_count: number;
}

export const tasks = {
  namespaced: true,

  state (): StateInterface {
    return {
      pending_count: 0
    }
  },

  mutations: {
    pending_count (state: StateInterface, payload: number) {
      state.pending_count = payload
    }
  },

  actions: {
    /**
     *
     * @param ctx
     */
    async pending_count (ctx: ActionContext<StateInterface, RootStateInterface>) {
      return new Promise<void>((resolve) => {
        new Tasks()
          .count({ state: 'pending' })
          .then((response) => {
            ctx.commit('pending_count', response.data.count)
            resolve()
          })
      })
    }
  },

  getters: {
    pending_count (state: StateInterface): number { return state.pending_count }
  }
}

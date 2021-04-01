import Tasks from '@/api/Tasks'

interface StateInterface {
  total_count: number;
  done_count: number;
  pending_count: number;
}

export const tasks = {
  namespaced: true,

  state (): StateInterface {
    return {
      total_count: 0,
      done_count: 0,
      pending_count: 0
    }
  },

  mutations: {
    set (state: StateInterface, payload: StateInterface) {
      state.done_count = payload.done_count
      state.pending_count = payload.pending_count
      state.total_count = payload.total_count
    }
  },

  actions: {
    async fetchCount ({ commit }: any, params = {}) {
      return new Promise<void>((resolve) => {
        new Tasks()
          .count(params)
          .then((response) => {
            commit('set', response)
          })
          .catch(() => {
            commit('set', {
              done_count: 0,
              pending_count: 0,
              total_count: 0
            })
          })
          .finally(resolve)
      })
    }
  },

  getters: {
    total_count (state: StateInterface): number { return state.total_count },
    pending_count (state: StateInterface): number { return state.pending_count },
    done_count (state: StateInterface): number { return state.done_count }
  }
}

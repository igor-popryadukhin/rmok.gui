import { Database, StatusInterface } from '@/api/Database'

interface StateInterface {
  statuses: StatusInterface[];
}

export const database = {
  namespaced: true,

  state (): StateInterface {
    return {
      statuses: []
    }
  },

  mutations: {
    setStatuses (state: StateInterface, payload: StatusInterface[]) {
      state.statuses = payload
    }
  },

  actions: {
    /**
     * Загрузить статусы
     *
     * @param commit
     */
    async fetchStatuses ({ commit }: any) {
      return new Promise<void>((resolve) => {
        new Database()
          .statuses()
          .then((response) => {
            commit('setStatuses', response.data)
          }).finally(resolve)
      })
    }
  },

  getters: {
    statuses (state: StateInterface): StatusInterface[] { return state.statuses }
  }
}

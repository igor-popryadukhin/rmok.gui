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
    /**
     * @param state
     * @param payload
     */
    statuses (state: StateInterface, payload: StatusInterface[]): void {
      state.statuses = payload
    }
  },

  actions: {
    /**
     * Загрузить статусы
     *
     * @param commit
     * @param params
     */
    async statuses ({ commit }: any, params = {}): Promise<void> {
      return new Promise<void>((resolve) => {
        new Database()
          .statuses(Object.assign({}, {
            group: 1 // Группировать
          }, params))
          .then((response) => {
            commit('statuses', response.data)
            resolve()
          })
      })
    }
  },

  getters: {
    statuses (state: StateInterface): StatusInterface[] { return state.statuses }
  }
}

import { Database, StatusInterface } from '@/api/Database'

interface StateInterface {
  statuses_not_group: StatusInterface[];
  statuses_grouped: StatusInterface[];
}

export const database = {
  namespaced: true,

  state (): StateInterface {
    return {
      statuses_not_group: [],
      statuses_grouped: []
    }
  },

  mutations: {
    /**
     * @param state
     * @param payload
     */
    statuses_not_group (state: StateInterface, payload: StatusInterface[]): void {
      state.statuses_not_group = payload
    },

    /**
     * @param state
     * @param payload
     */
    statuses_grouped (state: StateInterface, payload: StatusInterface[]): void {
      state.statuses_grouped = payload
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
        // Загрузка сгруппированных статусов.
        new Database()
          .statuses(Object.assign({}, params, {
            group: 1
          }))
          .then((response) => {
            commit('statuses_grouped', response.data)
            resolve()
          })

        // Загрузка не сгруппированных статусов.
        new Database()
          .statuses(Object.assign({}, params))
          .then((response) => {
            commit('statuses_not_group', response.data)
            resolve()
          })
      })
    }
  },

  getters: {
    statuses_not_grouped (state: StateInterface): StatusInterface[] { return state.statuses_not_group },
    statuses_grouped (state: StateInterface): StatusInterface[] { return state.statuses_grouped }
  }
}

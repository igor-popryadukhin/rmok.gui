import Projects, { ProjectInterface, StatusInterface } from '@/api/Projects'

export const project = {

  namespaced: true,

  state () {
    return {
      /* eslint-disable */
      id: 0,
      name: '',
      comment: '',
      statuses: [] as StatusInterface[],
      created_at: 0
      /* eslint-enable */
    } as ProjectInterface
  },

  mutations: {
    set (state: ProjectInterface, payload: ProjectInterface) {
      /* eslint-disable */
      state.id = payload.id
      state.name = payload.name
      state.statuses = payload.statuses
      state.created_at = payload.created_at
      /* eslint-enable */
    }
  },

  actions: {
    async load ({ commit }: any) {
      return new Promise(resolve => {
        new Projects()
          .current()
          .then((project: ProjectInterface) => { commit('set', project) })
          .catch(() => {
            commit('set', {
              id: 0,
              name: '',
              comment: '',
              statuses: [],
              created_at: 0
            })
          })
          .finally(resolve)
      })
    }
  },

  getters: {
    /* eslint-disable */
    is (state: ProjectInterface) { return state },
    id (state: ProjectInterface) { return state.id },
    name (state: ProjectInterface) { return state.name },
    created_at (state: ProjectInterface) { return state.created_at },
    statuses (state: ProjectInterface) { return state.statuses }
    /* eslint-enable */
  }
}

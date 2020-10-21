import { Account, ProfileInterface, Role } from '@/api/Account'

export const profile = {

  namespaced: true,

  state () {
    return {
      /* eslint-disable */
      id: 0,
      created_at: 0,
      email: '',
      first_name: '',
      last_name: '',
      login: '',
      middle_name: '',
      role: {
        attributes: [],
        id: '',
        name: ''
      } as Role,
      userpic: null
      /* eslint-enable */
    } as ProfileInterface
  },

  mutations: {
    set (state: ProfileInterface, payload: ProfileInterface) {
      /* eslint-disable */
      state.id = payload.id
      state.login = payload.login
      state.email = payload.email
      state.first_name = payload.first_name
      state.last_name = payload.last_name
      state.middle_name = payload.middle_name
      state.role = payload.role
      state.userpic = payload.userpic
      state.created_at = payload.created_at
      /* eslint-enable */
    }
  },

  actions: {
    loadProfile ({ commit }: any) {
      new Account().getProfile().then((profile) => {
        commit('set', profile)
      })
    }
  },

  getters: {
    /* eslint-disable */
    id (state: ProfileInterface) { return state.id },
    first_name (state: ProfileInterface) { return state.first_name },
    last_name (state: ProfileInterface) { return state.last_name },
    middle_name (state: ProfileInterface) { return state.middle_name },
    login (state: ProfileInterface) { return state.login },
    email (state: ProfileInterface) { return state.email },
    role (state: ProfileInterface) { return state.role },
    userpic (state: ProfileInterface) { return state.userpic }
    /* eslint-enable */
  }
}

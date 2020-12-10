import { Account, ProfileInterface, Role } from '@/api/Account'

export const profile = {

  namespaced: true,

  state () {
    return {
      /* eslint-disable */
      id: 0,
      created_at: 0,
      email: '',
      phone: '',
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
      state.phone = payload.phone
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
      return new Promise((resolve) => {
        new Account().getProfile()
          .then((profile) => {
            commit('set', profile)
          }).finally(resolve)
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
    phone (state: ProfileInterface) { return state.phone },
    project (state: ProfileInterface) { return state.email },
    role (state: ProfileInterface) { return state.role },
    role_id (state: ProfileInterface) { return state.role.id },
    role_is_operator (state: ProfileInterface) { return state.role.id === 'r_operator' },
    role_is_admin (state: ProfileInterface) { return state.role.id === 'r_admin' },
    role_is_leader_cc (state: ProfileInterface) { return state.role.id === 'r_leader_cc' },
    role_is_team_leader (state: ProfileInterface) { return state.role.id === 'r_team_leader' },
    userpic (state: ProfileInterface) { return state.userpic }
    /* eslint-enable */
  }
}

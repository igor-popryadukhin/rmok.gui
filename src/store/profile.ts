import { Account, ProfileInterface, Role } from '@/api/Account'

interface StateInterface {
  [key: string]: any;
}

export const profile = {

  actions: {
    loadProfile ({ commit }: any): Promise<any> {
      return new Promise((resolve: any) => {
        new Account()
          .getProfile()
          .then((profile) => {
            commit('set', profile)
            commit('setStatus', profile.status)
            commit('permissions', profile.permissions)
          }).finally(resolve)
      })
    }
  },

  getters: {

    email (state: StateInterface): string { return state.email },

    first_name (state: StateInterface): string { return state.first_name },
    // Идентификатор текущего аккаунта
    id (state: StateInterface): number { return state.id },
    is_super_admin (state: StateInterface): boolean { return state.is_super_admin },
    last_name (state: StateInterface): string { return state.last_name },
    login (state: StateInterface): string { return state.login },
    middle_name (state: StateInterface): string { return state.middle_name },
    organization (state: StateInterface) { return state.organization },
    permissions (state: StateInterface): string[] { return state.role.permissions },
    phone (state: StateInterface): string { return state.phone },
    project (state: StateInterface): string { return state.email },
    role (state: StateInterface) { return state.role },
    role_id (state: StateInterface) { return state.role.id },
    role_name (state: StateInterface): string { return state.role.name },
    role_use (state: StateInterface): 'for_administration' | 'for_calls' { return state.role.use },
    status (state: StateInterface) { return state.status },
    tz (state: StateInterface): string { return state.tz },
    userpic (state: StateInterface): string { return state.userpic }
  },

  mutations: {
    permissions (state: StateInterface, payload: string[]): void {
      state.permissions = payload
    },

    set (state: StateInterface, payload: ProfileInterface): void {
      /* eslint-disable */
      state.id = payload.id
      state.login = payload.login
      state.email = payload.email
      state.phone = payload.phone
      state.first_name = payload.first_name
      state.last_name = payload.last_name
      state.middle_name = payload.middle_name
      state.role = payload.role
      state.is_super_admin = payload.is_super_admin
      state.userpic = payload.userpic
      state.created_at = payload.created_at
      state.organization = payload.organization
      state.tz = payload.tz
      /* eslint-enable */
    },

    setStatus (state: StateInterface, payload: string): void {
      state.status = payload
    }
  },

  namespaced: true,

  state (): StateInterface {
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
      is_super_admin: false,
      role: {
        permissions: [],
        id: '',
        use: '',
        name: ''
      },
      userpic: null,
      status: '',
      organization: {
        address: '',
        description: '',
        email: '',
        id: 0,
        name: '',
        region: '',
        site: '',
        sphere_activity: '',
        tags: undefined
      },
      tz: null
      /* eslint-enable */
    }
  }
}

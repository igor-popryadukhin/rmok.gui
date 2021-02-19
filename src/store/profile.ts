import { Account, ProfileInterface, Role } from '@/api/Account'

interface StateInterface {
  [key: string]: any;
}

export const profile = {

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
      }
      /* eslint-enable */
    }
  },

  mutations: {
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
      /* eslint-enable */
    },

    setStatus (state: StateInterface, payload: string): void {
      state.status = payload
    },

    permissions (state: StateInterface, payload: string[]): void {
      state.permissions = payload
    }
  },

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
    // Идентификатор текущего аккаунта
    id (state: StateInterface): number { return state.id },
    first_name (state: StateInterface): string { return state.first_name },
    last_name (state: StateInterface): string { return state.last_name },
    middle_name (state: StateInterface): string { return state.middle_name },
    login (state: StateInterface): string { return state.login },
    email (state: StateInterface): string { return state.email },
    phone (state: StateInterface): string { return state.phone },
    project (state: StateInterface): string { return state.email },
    role (state: StateInterface) { return state.role },
    role_id (state: StateInterface) { return state.role.id },
    role_use (state: StateInterface): string { return state.role.use },
    role_name (state: StateInterface): string { return state.role.name },
    userpic (state: StateInterface): string { return state.userpic },
    status (state: StateInterface) { return state.status },
    organization (state: StateInterface) { return state.organization },
    permissions (state: StateInterface): string[] { return state.role.permissions },
    is_super_admin (state: StateInterface): boolean { return state.is_super_admin }
  }
}

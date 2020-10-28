import { RoleInterface, Roles } from '@/api/Roles'
import { GroupInterface, Groups } from '@/api/Groups'
import { CountryCodeInterface, Database } from '@/api/Database'

/* eslint-disable */
export const system = {

  namespaced: true,

  state () {
    return {
      roles: [] as RoleInterface[],
      country_codes: [] as CountryCodeInterface[],
      groups: [] as GroupInterface[]
    }
  },

  mutations: {
    roles (state: any, payload: RoleInterface[]) { state.roles = payload },
    country_codes (state: any, payload: CountryCodeInterface[]) { state.country_codes = payload },
    groups (state: any, payload: GroupInterface[]) { state.groups = payload }
  },

  actions: {
    roles ({ commit }: any) { new Roles().get().then((roles: RoleInterface[]) => { commit('roles', roles) }) },
    country_codes ({ commit }: any) { new Database().getCountryCodes().then((country_codes: CountryCodeInterface[]) => { commit('country_codes', country_codes) }) },
    groups ({ commit }: any) { new Groups().find().then((groups: GroupInterface[]) => { commit('groups', groups) }) }
  },

  getters: {
    roles (state: any) { return state.roles },
    country_codes (state: any) { return state.country_codes },
    groups (state: any) { return state.groups }
  }
}

import { RoleInterface, Roles } from '@/api/Roles'
import { GroupInterface, Groups } from '@/api/Groups'
import { CountryCodeInterface, Database } from '@/api/Database'

interface StateInterface {
  /**
   * Полный путь URL для перенаправления
   * --------------------------------------
   * Используется для перенаправления на целевую страницу.
   * Например, если требуется сохранить полный путь до страницы, что бы потом вернуться на неё.
   */
  route_last_full_path: string;
  roles: RoleInterface[];
  country_codes: CountryCodeInterface[];
  groups: GroupInterface[];
}

/* eslint-disable */
export const system = {

  namespaced: true,

  state (): StateInterface {
    return {
      route_last_full_path: '',
      roles: [] as RoleInterface[],
      country_codes: [] as CountryCodeInterface[],
      groups: [] as GroupInterface[]
    }
  },

  mutations: {
    route_last_full_path (state: StateInterface, payload: string) { state.route_last_full_path = payload },
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
    route_last_full_path (state: StateInterface): string {
      return state.route_last_full_path
    },
    roles (state: any) { return state.roles },
    country_codes (state: any) { return state.country_codes },
    groups (state: any) { return state.groups }
  }
}

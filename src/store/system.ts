import { RoleInterface, Roles } from '@/api/Roles'
import { GroupInterface, Groups } from '@/api/Groups'

export const system = {

  namespaced: true,

  state () {
    return {
      roles: [] as RoleInterface[],
      groups: [] as GroupInterface[]
    }
  },

  mutations: {
    roles (state: any, payload: RoleInterface[]) { state.roles = payload },
    groups (state: any, payload: GroupInterface[]) { state.groups = payload }
  },

  actions: {
    roles ({ commit }: any) { new Roles().get().then((roles: RoleInterface[]) => { commit('roles', roles) }) },
    groups ({ commit }: any) { new Groups().find().then((groups: GroupInterface[]) => { commit('groups', groups) }) }
  },

  getters: {
    roles (state: any) { return state.roles },
    groups (state: any) { return state.groups }
  }
}

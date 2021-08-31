import User from '@/api/interfaces/User'
import { ProfileState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ProfileState> = {
  /**
   * Загрузит текущий профиль пользователя.
   *
   * @param state
   * @param payload
   */
  fill (state, payload: User) {
    state.id = payload.id
    state.first_name = payload.first_name
    state.last_name = payload.last_name
    state.middle_name = payload.middle_name
    state.country = payload.country
    state.phone = payload.phone
    state.email = payload.email
    state.role = payload.role
    state.login = payload.login
    state.organization = payload.organization
    state.tz = payload.tz
    state.project = payload.project
  },

  tz (state: ProfileState, payload: string) { state.tz = payload }
}

export default mutations

import User from '@/api/interfaces/User'
import { ProfileState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ProfileState> = {
  mode (state, payload) { state.mode = payload },

  /**
   *
   * @param state
   * @param payload
   */
  fill (state, payload: User) {
    state.id = payload.id
    state.first_name = payload.first_name
    state.last_name = payload.last_name
    state.middle_name = payload.middle_name
    state.full_name = payload.full_name
    state.abbreviation = payload.abbreviation
    state.country = payload.country
    state.phone = payload.phone
    state.email = payload.email
    state.login = payload.login
    state.tz = payload.tz
    state.group = payload.group
    state.status = payload.status
    state.mode = payload.mode
  },

  tz (state: ProfileState, payload: string) { state.tz = payload }
}

export default mutations

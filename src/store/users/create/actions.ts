import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import Users from '@/api/Users'

const actions: ActionTree<State, RootState> = {
  create: ({ commit, state }) => {
    const postData: Record<string, string|number> = {}

    // Обязательные
    postData.first_name = state.first_name
    postData.last_name = state.last_name
    postData.middle_name = state.middle_name
    postData.login = state.login
    postData.password = state.password
    postData.role_id = state.role_id

    // Опционально
    if (state.email) {
      postData.email = state.email
    }

    if (state.country_id) {
      postData.country_id = state.country_id
    }

    if (state.group_id) {
      postData.group_id = state.group_id
    }
    return new Users()
      .create(postData)
      .then((id) => {
        commit('resetState')
        return id
      })
  },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param commit
   */
  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions

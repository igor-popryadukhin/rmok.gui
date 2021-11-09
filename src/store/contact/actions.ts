import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import { Contacts } from '@/api/Contacts'

const actions: ActionTree<State, RootState> = {
  /**
   * Заполняет данными о контакте по идентификатору телефона.
   *
   * @param commit
   * @param state
   * @param id
   */
  get_by_id ({ commit, state }, id: number) {
    return new Promise<void>((resolve) => {
      new Contacts()
        .getById(id)
        .then((response) => {
          save(commit, state, response)
          resolve()
        })
    })
  },

  /**
   * Заполняет данными о контакте по номеру телефона.
   *
   * @param commit
   * @param state
   * @param number
   */
  get_by_phone_number ({ commit, state }, number: string) {
    return new Promise<void>((resolve) => {
      new Contacts()
        .getByPhoneNumber(number)
        .then((response) => {
          save(commit, state, response)
          resolve()
        })
    })
  },

  reset_state: ({ commit }) => {
    commit('reset_state')
  }
}

function save (commit, state, payload) {
  for (const name in payload) {
    if (Object.hasOwnProperty.call(payload, name) && Object.hasOwnProperty.call(state, name)) {
      commit(name, payload[name])
    }
  }
}

export default actions

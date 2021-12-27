import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import Projects from '@/api/Projects'
import APIError from '@/api/classes/APIError'

const actions: ActionTree<State, RootState> = {
  show: ({ commit }) => {
    commit('visible', true)
  },

  hide: ({ commit }) => {
    commit('visible', false)
  },

  reset: ({ commit }) => {
    commit('project_id', 0)
    commit('user_ids', [])
  },

  /**
   * Позволяет передавать контакты другим пользователям.
   *
   * @param commit
   * @param state
   * @param rootGetters
   */
  transfer: ({ dispatch, state, rootGetters }) => {
    // Скрываю диалог передачи контактов
    dispatch('hide')

    let params: Record<string, any> = rootGetters['contacts/list/filter/all']

    if ((rootGetters['contacts/list/items_selected'] || []).length > 0 && !rootGetters['contacts/list/selected_all']) {
      params = {
        ids: rootGetters['contacts/list/items_selected']
      }
    }

    if ('offset' in params) { delete params.offset }
    if ('count' in params) { delete params.count }

    return new Promise<void>((resolve, reject) => {
      $axios.post('/contacts/transfer', {
        params,
        destination_project_id: state.project_id,
        destination_user_ids: state.user_ids
      })
        .then((response: AxiosResponse) => {
          if (![200, 202].includes(response.status)) {
            throw new APIError(response.data)
          }
          dispatch('reset')
          resolve()
        }).catch(reject)
    })
  },

  fetchProjects: ({ commit, state }, params = {}) => {
    new Projects()
      .find({
        ...params
      }).then((response) => {
        const itemsCopy = state.available_projects.map((value) => value)
        response.data.forEach((value) => {
          if (itemsCopy.findIndex((e: any) => e.id === value.id) === -1) {
            itemsCopy.push(value)
          }
        })
        commit('available_projects', itemsCopy)
      })
  },

  fetchUsers: ({ commit, state }, params = {}) => {
    return new Promise<void>((resolve) => {
      $axios.get('/users', { params })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            const itemsCopy = state.available_users.map((value) => value)

            response.data?.data.forEach((value: any) => {
              if (itemsCopy.findIndex((e: any) => e.id === value.id) === -1) {
                itemsCopy.push(value)
              }
            })
            commit('available_users', itemsCopy)
            resolve()
          }
        })
    })
  }
}

export default actions

import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import Projects from '@/api/Projects'
import Statuses from '@/api/Statuses'
import { $axios } from '@/plugins/axios'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'

const cancelTokenSourcesTags: CancelTokenSource[] = []

const actions: ActionTree<State, RootState> = {
  fetchProjects: ({ commit, state }, params = {}) => {
    new Projects()
      .find({
        ...params
      }).then((response) => {
        const itemsCopy = state.projects.map((value) => value)
        response.data.forEach((value) => {
          if (itemsCopy.findIndex((e) => e.id === value.id) === -1) {
            itemsCopy.push(value)
          }
        })
        commit('projects', itemsCopy)
      })
  },

  fetchStatuses: ({ commit, state }, params = {}) => {
    return new Statuses()
      .find(params)
      .then((response) => {
        const itemsCopy = state.statuses.map((value) => value)
        response.forEach((value) => {
          if (itemsCopy.findIndex((e) => e.id === value.id) === -1) {
            itemsCopy.push(value)
          }
        })
        commit('statuses', itemsCopy)
      })
  },

  fetchUsers: ({ commit, state }, params = {}) => {
    return new Promise<void>((resolve) => {
      $axios.get('/users', { params })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            const itemsCopy = state.users.map((value) => value)

            response.data?.data.forEach((value) => {
              if (itemsCopy.findIndex((e) => e.id === value.id) === -1) {
                itemsCopy.push(value)
              }
            })
            commit('users', itemsCopy)
            resolve()
          }
        })
    })
  },

  fetchUserGroups: ({ commit, state }, params = {}) => {
    return new Promise<void>((resolve) => {
      $axios.get('/groups', { params })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            const itemsCopy = state.user_groups.map((value) => value)

            response.data?.data.forEach((value) => {
              if (itemsCopy.findIndex((e) => e.id === value.id) === -1) {
                itemsCopy.push(value)
              }
            })
            commit('user_groups', itemsCopy)
            resolve()
          }
        })
    })
  },

  fetchTags: ({ commit, state }, params = {}) => {
    const len = cancelTokenSourcesTags.length
    for (let i = 0; i < len; i++) {
      cancelTokenSourcesTags.pop()?.cancel()
    }

    const cancelTokenSource = axios.CancelToken.source()
    cancelTokenSourcesTags.push(cancelTokenSource)

    return new Promise<void>((resolve) => {
      $axios.get('/contacts/tags', {
        params,
        cancelToken: cancelTokenSource.token
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          const itemsCopy = state.tags.map((value) => value)

          response.data?.data.forEach((value) => {
            if (itemsCopy.findIndex((e) => e.id === value.id) === -1) {
              itemsCopy.push(value)
            }
          })
          commit('tags', itemsCopy)
          resolve()
        }
      })
    })
  },

  fetchTimeZones: ({ commit }) => {
    return new Promise<void>((resolve) => {
      $axios.get('/handbooks/timezones')
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new Error(response.statusText)
          }

          commit('timezones', response.data || [])
          resolve()
        })
    })
  }
}

export default actions

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { profile } from '@/store/profile'
import { system } from './system'
import { project } from '@/store/project'
import tasks from '@/store/tasks'
import { database } from '@/store/database'

Vue.use(Vuex)

const get = (key: string) => localStorage.getItem(key)
const set = (key: string, value: string) => localStorage.setItem(key, value)
const remove = (key: string) => localStorage.getItem(key)

export interface RootStateInterface {
  root: number
}

const store = new Vuex.Store({
  state (): RootStateInterface {
    return {
      root: 0 // todo: example
    }
  },

  mutations: {
  },
  actions: {
  },
  modules: {
    tasks,
    profile,
    project,
    system,
    database
  },
  plugins: [
    createPersistedState({
      key: 'rmok',
      paths: [],
      storage: {
        getItem: (key) => get(key),
        setItem: (key, value) => set(key, value),
        removeItem: (key) => remove(key)
      }
    }),
    createPersistedState({
      key: 'rmok-profile',
      paths: ['profile'],
      storage: {
        getItem: (key: string) => get(key),
        setItem: (key, value) => set(key, value),
        removeItem: (key: string) => remove(key)
      }
    }),
    createPersistedState({
      key: 'rmok-system',
      paths: ['system'],
      storage: {
        getItem: (key: string) => get(key),
        setItem: (key, value) => set(key, value),
        removeItem: (key: string) => remove(key)
      }
    }),
    createPersistedState({
      key: 'rmok-project',
      paths: ['project'],
      storage: {
        getItem: (key: string) => get(key),
        setItem: (key, value) => set(key, value),
        removeItem: (key: string) => remove(key)
      }
    }),
    createPersistedState({
      key: 'rmok-tasks',
      paths: ['tasks'],
      storage: {
        getItem: (key: string) => get(key),
        setItem: (key, value) => set(key, value),
        removeItem: (key: string) => remove(key)
      }
    }),
    createPersistedState({
      key: 'rmok-database',
      paths: ['database'],
      storage: {
        getItem: (key: string) => get(key),
        setItem: (key, value) => set(key, value),
        removeItem: (key: string) => remove(key)
      }
    })
  ]
})

export default store

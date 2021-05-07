import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { profile } from '@/store/profile'
import { system } from './system'
import project from './project'
import tasks from '@/store/tasks'
import settings from '@/store/settings'
import { database } from '@/store/database'

Vue.use(Vuex)

const get = (key: string) => localStorage.getItem(key)
const set = (key: string, value: string) => localStorage.setItem(key, value)
const remove = (key: string) => localStorage.getItem(key)

export interface RootStateInterface {
  root: number
}

const store = new Vuex.Store({
  actions: {
  },

  modules: {
    database,
    profile,
    project,
    settings,
    system,
    tasks
  },
  mutations: {
  },
  plugins: [
    createPersistedState({
      key: 'rmok',
      paths: [],
      storage: {
        getItem: (key) => get(key),
        removeItem: (key) => remove(key),
        setItem: (key, value) => set(key, value)
      }
    }),
    createPersistedState({
      key: 'rmok-profile',
      paths: ['profile'],
      storage: {
        getItem: (key: string) => get(key),
        removeItem: (key: string) => remove(key),
        setItem: (key, value) => set(key, value)
      }
    }),
    createPersistedState({
      key: 'rmok-system',
      paths: ['system'],
      storage: {
        getItem: (key: string) => get(key),
        removeItem: (key: string) => remove(key),
        setItem: (key, value) => set(key, value)
      }
    }),
    createPersistedState({
      key: 'rmok-project',
      paths: ['project'],
      storage: {
        getItem: (key: string) => get(key),
        removeItem: (key: string) => remove(key),
        setItem: (key, value) => set(key, value)
      }
    }),
    createPersistedState({
      key: 'rmok-tasks',
      paths: ['tasks'],
      storage: {
        getItem: (key: string) => get(key),
        removeItem: (key: string) => remove(key),
        setItem: (key, value) => set(key, value)
      }
    }),
    createPersistedState({
      key: 'rmok-database',
      paths: ['database'],
      storage: {
        getItem: (key: string) => get(key),
        removeItem: (key: string) => remove(key),
        setItem: (key, value) => set(key, value)
      }
    }),
    createPersistedState({
      key: 'rmok-settings',
      paths: ['settings'],
      storage: {
        getItem: (key: string) => get(key),
        removeItem: (key: string) => remove(key),
        setItem: (key, value) => set(key, value)
      }
    })
  ],
  state (): RootStateInterface {
    return {
      root: 0 // todo: example
    }
  }
})

export default store

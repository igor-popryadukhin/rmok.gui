import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { system } from './system'
import project from './project'
import tasks from './tasks'
import settings from './settings'
import filter from './filter'
import symfony from './symfony'
import profile from './profile'
import statuses from './statuses'
import { database } from './database'
import debug from 'debug'

Vue.use(Vuex)

const get = (key: string) => localStorage.getItem(key)
const set = (key: string, value: string) => localStorage.setItem(key, value)
const remove = (key: string) => localStorage.getItem(key)

export interface RootState {
  root: number;
}

const store = new Vuex.Store({
  strict: true,
  state (): RootState {
    return {
      root: 0
    }
  },

  modules: {
    database,
    profile,
    project,
    statuses,
    settings,
    filter,
    system,
    symfony,
    tasks
  },

  mutations: {},

  getters: {},

  plugins: [
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
    }),
    createPersistedState({
      key: 'rmok-filters',
      paths: ['filter'],
      storage: {
        getItem: (key: string) => get(key),
        removeItem: (key: string) => remove(key),
        setItem: (key, value) => set(key, value)
      }
    }),
    createPersistedState({
      key: 'rmok-symfony',
      paths: ['symfony'],
      storage: {
        getItem: (key: string) => get(key),
        removeItem: (key: string) => remove(key),
        setItem: (key, value) => set(key, value)
      }
    })
  ]
})

const vuexDebug = debug('VUEX')
const vuexDebugActions = vuexDebug.extend('ACTION')

store.subscribeAction((ap, rs) => {
  vuexDebugActions('%o %o', ap, rs)
})

export default store

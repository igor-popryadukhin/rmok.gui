import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import project from './project'
import tasks from './tasks'
import settings from './settings'
import filter from './filter'
import symfony from './symfony'
import profile from './profile'
import statuses from './statuses'
import contacts from './contacts'
import { database } from './database'
import debug from 'debug'
import { debounce } from 'vuetify/src/util/helpers'

Vue.use(Vuex)

const vuexDebug = debug('VUEX')
const vuexDebugActions = vuexDebug.extend('ACTION')
const vuexDebugPersistedstate = vuexDebug.extend('PERSISTEDSTATE')

const get = (key: string) => {
  vuexDebugPersistedstate('GET: %s', key)
  return localStorage.getItem(key)
}

const set = debounce((key: string, value: string) => {
  vuexDebugPersistedstate('SET: %s [%o]', key, value)
  localStorage.setItem(key, value)
}, 1000)

const remove = (key: string) => {
  vuexDebugPersistedstate('REMOVE: %s', key)
  localStorage.removeItem(key)
}

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
    symfony,
    tasks,
    contacts
  },

  mutations: {},

  getters: {},

  plugins: [
    createPersistedState({
      key: window.origin,
      paths: ['profile', 'tasks', 'database', 'settings', 'filters', 'symfony', 'contacts.params'],
      storage: {
        getItem: (key: string) => get(key),
        removeItem: (key: string) => remove(key),
        setItem: (key, value) => set(key, value)
      }
    })
  ]
})

store.subscribeAction((ap, rs) => {
  vuexDebugActions('%o %o', ap, rs)
})

export default store

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import project from './project'
import tasks from './tasks'
import settings from './settings'
import filter from './filter'
import symfony from './symfony'
import system from './system'
import profile from './profile'
import statuses from './statuses'
import users from './users'
import contacts from './contacts'
import contacts_new from './contacts_new'
import contacts_queue from './contacts_queue'
import statistic_recent_call from './statistic_recent_call'
import { database } from './database'
import debug from 'debug'

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
    system,
    tasks,
    users,
    contacts,
    contacts_new,
    contacts_queue,
    statistic_recent_call
  },

  mutations: {},

  getters: {},

  plugins: [
    createPersistedState({
      key: window.origin,
      paths: [
        'profile',
        'tasks',
        'database',
        'settings',
        'filters',
        'symfony',
        'contacts.params',
        'statistic_recent_call.filter'
      ],
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

function debounce (fn: CallableFunction, delay: number) {
  let timeoutId = 0 as any
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

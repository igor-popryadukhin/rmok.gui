import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import app_state from './app_state'
import project from './project'
import tasks from './tasks'
import settings from './settings'
import filter from './filter'
import symfony from './symfony'
import system from './system'
import profile from './profile'
import statuses from './statuses'
import users from './users'
import users_edit from './users_edit'
import contacts from './contacts'
import contacts_new from './contacts_new'
import statistic_recent_call from './statistic_recent_call'
import statistic_all_call from './statistic_all_call'
import autodialer from './autodialer'
import unsaved_call from './unsaved_call'
import contact from './contact'
import incoming_dialog from './incoming_dialog'
import statistic_activity from './statistic_activity'
import { database } from './database'
import debug from 'debug'
import $app from '@/main'

Vue.use(Vuex)

const vuexDebug = debug('VUEX')
const vuexDebugActions = vuexDebug.extend('ACTION')
const vuexDebugMutations = vuexDebug.extend('MUTATION')
const vuexDebugPersistedState = vuexDebug.extend('PERSISTED-STATE')
const vuexDebugPersistedStateGet = vuexDebugPersistedState.extend('GET')
const vuexDebugPersistedStateSet = vuexDebugPersistedState.extend('SET')
const vuexDebugPersistedStateRemove = vuexDebugPersistedState.extend('REMOVE')

const get = (key: string) => {
  const value = localStorage.getItem(key)
  vuexDebugPersistedStateGet('%s [%o]', key, value)
  return value
}

const set = debounce((key: string, value: string) => {
  vuexDebugPersistedStateSet('%s [%o]', key, value)
  localStorage.setItem(key, value)
}, 1000)

const remove = (key: string) => {
  vuexDebugPersistedStateRemove(key)
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
    app_state,
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
    users_edit,
    unsaved_call,
    incoming_dialog,
    contact_view: contact,
    contact_incoming: contact,
    contact_outgoing: contact,
    contacts,
    contacts_new,
    statistic_recent_call,
    statistic_all_call,
    autodialer,
    statistic_activity
  },

  mutations: {},

  getters: {
    routeParams: () => Object.assign({}, $app.$route.params)
  },

  plugins: [
    createPersistedState({
      key: window.origin,
      paths: [
        'unsaved_call',
        // 'profile',
        'database',
        'settings',
        'filters',
        'symfony',
        'contacts.params',
        'contacts.list.filter',
        'statistic_recent_call.filter',
        'system.route'
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

store.subscribe((ap, rs) => {
  vuexDebugMutations('%o %o', ap, rs)
})

export default store

function debounce (fn: CallableFunction, delay: number) {
  let timeoutId = 0 as any
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

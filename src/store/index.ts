import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import app_state from './app_state'
import projects from './projects'
import { tasks } from './tasks'
import settings from './settings'
import filter from './filter'
import symfony from './symfony'
import system from './system'
import profile from './profile'
import groups from './groups'
import users from './users'
import contacts from './contacts'
import leads from './leads'
import statistic_recent_call from './statistic_recent_call'
import statistic_all_call from './statistic_all_call'
import autodialer from './autodialer'
import scenarios from './scenarios'
import unsaved_call from './unsaved_call'
import contact from './contact'
import incoming_dialog from './incoming_dialog'
import statistic_activity from './statistic_activity'
import { database } from './database'
import debug from 'debug'
import $app from '@/main'
import { account } from './account'
import { notifications } from './notifications'
import { roles } from './roles'
import { statistics } from './statistics'

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
    account,
    roles,
    notifications,
    app_state,
    database,
    profile,
    projects,
    settings,
    filter,
    symfony,
    system,
    tasks,
    groups,
    users,
    unsaved_call,
    incoming_dialog,
    contact_view: contact,
    contact_incoming: contact,
    contact_outgoing: contact,
    contacts,
    leads,
    statistics,
    statistic_recent_call,
    statistic_all_call,
    autodialer,
    statistic_activity,
    scenarios
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
        'contacts.list.settings',
        'contacts.view.settings',
        'contacts.view.unsaved_call',
        'statistic_recent_call.filter',
        'statistics.recent_calls.filter',
        'statistics.recent_calls.settings',
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

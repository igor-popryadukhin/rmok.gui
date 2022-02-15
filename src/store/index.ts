import StorageInterface from '@/store/StorageInterface'
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
import LocalStorage from './LocalStorage'
import SessionStorage from './SessionStorage'

Vue.use(Vuex)

const vuexDebug = debug('VUEX')
const vuexDebugActions = vuexDebug.extend('ACTION')
const vuexDebugMutations = vuexDebug.extend('MUTATION')
const vuexDebugPersistedState = vuexDebug.extend('PERSISTED-STATE')
const vuexDebugPersistedStateGet = vuexDebugPersistedState.extend('GET')
const vuexDebugPersistedStateSet = vuexDebugPersistedState.extend('SET')
const vuexDebugPersistedStateRemove = vuexDebugPersistedState.extend('REMOVE')

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
    // Постоянное хранение
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
        'statistics.calls_count.settings',
        'system.route'
      ],
      storage: new LocalStorage()
    }),

    // Хранение в рамках сессии
    createPersistedState({
      key: window.origin,
      paths: [
        'statistics.calls_count.filter'
      ],
      storage: new SessionStorage()
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

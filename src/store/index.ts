import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import projects from './projects';
import settings from './settings';
import symfony from './symfony';
import system from './system';
import profile from './profile';
import groups from './groups';
import users from './users';
import contacts from './contacts';
import statistic_recent_call from './statistic_recent_call';
import statistic_all_call from './statistic_all_call';
import autodialer from './autodialer';
import scenarios from './scenarios';
import unsaved_call from './unsaved_call';
import statistic_activity from './statistic_activity';
import debug from 'debug';
import $app from '@/main';
import { notifications } from './notifications';
import { statistics } from './statistics';
import chats from './chats';
import tasks from './tasks';
import LocalStorage from './LocalStorage';
import SessionStorage from './SessionStorage';

Vue.use(Vuex);

const vuexDebug = debug('VUEX');
const vuexDebugActions = vuexDebug.extend('ACTION');
const vuexDebugMutations = vuexDebug.extend('MUTATION');

export interface RootState {
  last_call_at: Date|null;
  bootstrap_process: boolean;
  is_logged_in: boolean;
}

const $store = new Vuex.Store({
  strict: true,

  state (): RootState {
    return {
      last_call_at: null,
      bootstrap_process: true, // Процесс начальной загрузки
      is_logged_in: false // Состояние авторизации
    };
  },

  modules: {
    notifications,
    profile,
    projects,
    settings,
    symfony,
    system,
    groups,
    users,
    unsaved_call,
    contacts,
    statistics,
    statistic_recent_call,
    statistic_all_call,
    autodialer,
    statistic_activity,
    scenarios,
    chats,
    tasks
  },

  mutations: {
    last_call_at (state, payload) { state.last_call_at = payload; },
    bootstrap_process (state, payload) { state.bootstrap_process = payload; },
    is_logged_in (state, payload) { state.is_logged_in = payload; }
  },

  getters: {
    last_call_at: (state) => state.last_call_at,
    routeParams: () => Object.assign({}, $app.$route.params),
    bootstrap_process: (state) => state.bootstrap_process,
    is_logged_in: (state) => state.is_logged_in
  },

  plugins: [
    // Постоянное хранение
    createPersistedState({
      key: window.origin,
      paths: [
        'unsaved_call',
        'database',
        'settings',
        'filters',
        'symfony',
        'contacts.params',
        'contacts.list.settings',
        'contacts.list_in_work.settings',
        'contacts.view.settings',
        'contacts.view.unsaved_call',
        'statistics.recent_calls.settings',
        'statistics.calls_count.settings',
        'statistics.all_calls.settings',
        'statistics.manager_employment.settings',
        'system.route'
      ],
      storage: new LocalStorage()
    }),

    // Хранение в рамках сессии
    createPersistedState({
      key: window.origin,
      paths: [
        'contacts.list.filter',
        'contacts.list_in_work.filter',
        'statistics.all_calls.filter',
        'statistics.calls_count.filter',
        'statistics.recent_calls.filter',
        'statistics.manager_employment.filter'
      ],
      storage: new SessionStorage()
    })
  ]
});

$store.subscribeAction((ap, rs) => {
  vuexDebugActions('%o %o', ap, rs);
});

$store.subscribe((ap, rs) => {
  vuexDebugMutations('%o %o', ap, rs);
});

export default $store;

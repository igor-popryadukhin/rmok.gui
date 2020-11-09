import Vue from 'vue'
import Vuex from 'vuex'
import SecureLS from 'secure-ls'
import createPersistedState from 'vuex-persistedstate'
import { profile } from '@/store/profile'
import { system } from './system'
import { project } from '@/store/project'

Vue.use(Vuex)

const ls = new SecureLS({ isCompression: false })

/* eslint-disable */
function get (key: string) {
  return process.env.NODE_ENV === 'development' ? localStorage.getItem(key) : ls.get(key)
}

function set (key: string, value: any) {
  return process.env.NODE_ENV === 'development' ? localStorage.setItem(key, value) : ls.set(key, value)
}

function remove (key: string) {
  return process.env.NODE_ENV === 'development' ? localStorage.removeItem(key) : ls.remove(key)
}
/* eslint-enable */

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    profile,
    project,
    system
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
    })
  ]
})

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { profile } from '@/store/profile'
import { system } from './system'
import { project } from '@/store/project'

Vue.use(Vuex)

let get = (key: string) => localStorage.getItem(key)
let set = (key: string, value: string) => localStorage.setItem(key, value)
let remove = (key: string) => localStorage.getItem(key)

const loadSLS = () => import(/* webpackChunkName: "store-secure-ls" */ 'secure-ls/dist/secure-ls')
loadSLS()
  .then((a: any) => {
    const ls = a.default({ isCompression: false })
    /* eslint-disable */
    get = (key: string) => {
      return process.env.NODE_ENV === 'development' ? localStorage.getItem(key) : ls.get(key)
    }

    set = (key: string, value: any) => {
      return process.env.NODE_ENV === 'development' ? localStorage.setItem(key, value) : ls.set(key, value)
    }

    remove = (key: string) => {
      return process.env.NODE_ENV === 'development' ? localStorage.removeItem(key) : ls.remove(key)
    }
    /* eslint-enable */
  })

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

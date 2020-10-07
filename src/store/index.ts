import Vue from 'vue'
import Vuex from 'vuex'
import SecureLS from 'secure-ls'
import createPersistedState from 'vuex-persistedstate'

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
  },
  plugins: [
    createPersistedState({
      key: 'rit-system-main',
      paths: [],
      storage: {
        getItem: (key) => get(key),
        setItem: (key, value) => set(key, value),
        removeItem: (key) => remove(key)
      }
    }),
    createPersistedState({
      key: 'rit-system-profile',
      paths: ['profile'],
      storage: {
        getItem: (key: string) => get(key),
        setItem: (key, value) => set(key, value),
        removeItem: (key: string) => remove(key)
      }
    })
  ]
})

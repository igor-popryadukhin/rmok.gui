import { RootState } from '@/store'
import { Module } from 'vuex'
import list from './list'

const module: Module<any, RootState> = {
  namespaced: true,
  modules: {
    list
  }
}

export default module

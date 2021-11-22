import { RootState } from '@/store'
import { Module } from 'vuex'
import list from './list'
import view from './view'

const module: Module<any, RootState> = {
  namespaced: true,
  modules: {
    list,
    view
  }
}

export default module

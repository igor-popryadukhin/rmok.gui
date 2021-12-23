import { RootState } from '@/store'
import { Module } from 'vuex'
import list from './list'
import view from './view'
import create from './create'

const module: Module<any, RootState> = {
  namespaced: true,
  modules: {
    list,
    view,
    create
  }
}

export default module

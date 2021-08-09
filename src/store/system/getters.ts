import { RootState } from '@/store'
import { SystemState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<SystemState, RootState> = {}

export default getters

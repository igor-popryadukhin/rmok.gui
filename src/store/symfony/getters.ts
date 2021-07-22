import { RootState } from '@/store'
import { SymfonyStateInterface } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<SymfonyStateInterface, RootState> = {
  call_collection (state: SymfonyStateInterface) { return state.call_collection }
}

export default getters

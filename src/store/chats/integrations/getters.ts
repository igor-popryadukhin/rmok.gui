import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'
import {Messengers} from "@/api/interfaces/Messengers";


const getters: GetterTree<State, RootState> = {
  fetching (state: State) { return state.fetching },
  id (state: State) { return state.id },
  account_phone (state: State) { return state.account_phone },
  api_id (state: State) { return state.api_id },
  api_hash (state: State) { return state.api_hash },
  messenger (state: State) { return state.messenger }

}

export default getters

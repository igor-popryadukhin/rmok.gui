import { State } from './state'
import { MutationTree } from 'vuex'

export const mutations: MutationTree<State> = {
  name (state, payload) { state.name = payload },
  scenario (state, payload) { state.scenario = payload }
}

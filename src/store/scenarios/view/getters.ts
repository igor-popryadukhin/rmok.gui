import { RootState } from '@/store'
import { GetterTree } from 'vuex'
import { ScenarioViewState } from './state'

export const getters: GetterTree<ScenarioViewState, RootState> = {
  id (state: ScenarioViewState) { return state.id },
  name (state: ScenarioViewState) { return state.name },
  description (state: ScenarioViewState) { return state.description },
  scenario (state: ScenarioViewState) { return state.scenario }
}

import { ProjectInterface } from '@/api/Projects'
import { ProjectStateInterface } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ProjectStateInterface> = {
  /**
   *
   * @param state
   * @param payload
   */
  id (state, payload: number) { state.id = payload },

  /**
   *
   * @param state
   * @param payload
   */
  name (state, payload: string) { state.name = payload },

  /**
   *
   * @param state
   * @param payload
   */
  scenario (state, payload: string) { state.scenario = payload },

  /**
   *
   * @param state
   * @param payload
   */
  statuses (state, payload: any) { state.statuses = payload },

  /**
   *
   * @param state
   * @param payload
   */
  created_at (state, payload: number) { state.created_at = payload },

  available_count (state, payload: number) { state.available_count = payload },
  available (state, payload: ProjectInterface[]) { state.available = payload }
}

export default mutations

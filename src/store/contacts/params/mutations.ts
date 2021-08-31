import { defaultState, State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  filter_q (state: State, payload) { state.filter_q = payload },
  filter_project_id (state: State, payload) { state.filter_project_id = payload },
  filter_status_ids (state: State, payload) { state.filter_status_ids = payload },
  filter_user_id (state: State, payload) { state.filter_user_id = payload },
  filter_user_group_id (state: State, payload) { state.filter_user_group_id = payload },
  filter_tag_ids (state: State, payload) { state.filter_tag_ids = payload },
  filter_contact_created_at (state: State, payload) { state.filter_contact_created_at = payload },
  filter_calling (state: State, payload) { state.filter_calling = payload },
  filter_offset (state: State, payload) { state.filter_offset = payload },
  filter_task (state, payload) { state.filter_task = payload },
  order_by (state: State, payload) { state.order_by = payload },
  order_direction (state: State, payload) { state.order_direction = payload },

  resetState (state: State) {
    Object.assign(state, defaultState())
  }
}

export default mutations

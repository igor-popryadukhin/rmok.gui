import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  filter_q (state, payload) { state.filter_q = payload },
  filter_project_id (state, payload) { state.filter_project_id = payload },
  filter_status_ids (state, payload) { state.filter_status_ids = payload },
  filter_user_id (state, payload) { state.filter_user_id = payload },
  filter_user_group_id (state, payload) { state.filter_user_group_id = payload },
  filter_tag_ids (state, payload) { state.filter_tag_ids = payload },
  filter_contact_created_at (state, payload) { state.filter_contact_created_at = payload },
  filter_offset (state, payload) { state.filter_offset = payload },
  order_by (state, payload) { state.order_by = payload },
  order_direction (state, payload) { state.order_direction = payload }
}

export default mutations

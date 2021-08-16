import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  filter_q (state) { return state.filter_q },
  filter_project_id (state) { return state.filter_project_id },
  filter_status_ids (state) { return state.filter_status_ids },
  filter_user_id (state) { return state.filter_user_id },
  filter_user_group_id (state) { return state.filter_user_group_id },
  filter_tag_ids (state) { return state.filter_tag_ids },
  filter_contact_created_at (state) { return state.filter_contact_created_at },
  filter_offset (state) { return state.filter_offset },
  order_by (state) { return state.order_by },
  order_direction (state) { return state.order_direction }
}

export default getters

import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  filter_q (state: State) { return state.filter_q },
  filter_project_id (state: State) { return state.filter_project_id },
  filter_status_ids (state: State) { return state.filter_status_ids },
  filter_user_id (state: State) { return state.filter_user_id },
  filter_user_group_id (state: State) { return state.filter_user_group_id },
  filter_tag_ids (state: State) { return state.filter_tag_ids },
  filter_contact_created_at (state: State) { return state.filter_contact_created_at },
  filter_calling (state: State) { return state.filter_calling },
  filter_offset (state: State) { return state.filter_offset },
  filter_task (state) { return state.filter_task },
  filter_timezone (state: State) { return state.filter_timezone },
  order_by (state: State) { return state.order_by },
  order_direction (state: State) { return state.order_direction }
}

export default getters

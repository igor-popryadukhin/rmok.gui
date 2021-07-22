import { RootState } from '@/store'
import { TasksStateInterface } from '@/store/tasks/state'
import { GetterTree } from 'vuex'

const getters: GetterTree<TasksStateInterface, RootState> = {
  filter (state) { return state.filter },
  filter_planned_for (state) { return state.filter.planned_for },
  filter_status_id (state) { return state.filter.status_id },
  items (state) { return state.items },
  options_page (state) { return state.options.page },
  options_pages (state) { return state.options.pages },
  pending_count (state) { return state.pending_count }
}

export default getters

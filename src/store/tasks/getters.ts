import { RootStateInterface } from '@/store'
import { TasksStateInterface } from '@/store/tasks/state'
import { GetterTree } from 'vuex'

const getters: GetterTree<TasksStateInterface, RootStateInterface> = {
  pending_count (state) { return state.pending_count },
  options_pages (state) { return state.options.pages },
  options_page (state) { return state.options.page },
  filter (state) { return state.filter },
  filter_planned_for (state) { return state.filter.planned_for },
  filter_status_id (state) { return state.filter.status_id },
  items (state) { return state.items }
}

export default getters

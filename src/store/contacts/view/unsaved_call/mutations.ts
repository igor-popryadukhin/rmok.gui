import { UnsavedCallState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<UnsavedCallState> = {
  data_call_id (state, payload) { state.data_call_id = payload },
  data_status_id (state, payload) { state.data_status_id = payload },
  data_contact_id (state, payload) { state.data_contact_id = payload },
  data_contact_history_id (state, payload) { state.data_contact_history_id = payload },
  data_contact_name (state, payload) { state.data_contact_name = payload },
  data_direction (state, payload) { state.data_direction = payload },
  data_comment (state, payload) { state.data_comment = payload },

  persists (state, payload) { state.persists = payload },
  unsaved (state, payload) { state.unsaved = payload }
}

export default mutations

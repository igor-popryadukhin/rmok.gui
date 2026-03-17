import { State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  dialog_visible (state: State, payload) { state.dialog_visible = payload; },
  field_first_name (state: State, payload) { state.field_first_name = payload; },
  field_last_name (state: State, payload) { state.field_last_name = payload; },
  field_middle_name (state: State, payload) { state.field_middle_name = payload; }
};

export default mutations;

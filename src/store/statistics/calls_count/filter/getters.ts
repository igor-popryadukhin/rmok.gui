import { RootState } from '@/store';
import { State } from './state';
import { GetterTree } from 'vuex';

const getters: GetterTree<State, RootState> = {
  /// //////////////////////////////////////////////////////////////////////////
  period (state: State) { return state.period; },
  project (state: State) { return state.project; },
  users (state: State) { return state.users; },
  user_group (state: State) { return state.user_group; },
  call_types (state: State) { return state.call_types; },
  /// //////////////////////////////////////////////////////////////////////////
  all (state: State) {
    const obj: Record<string, unknown> = {};

    if (state.period) {
      obj.period = state.period;
    }

    if (state.project) {
      obj.project_id = state.project.id;
    }

    if (state.user_group) {
      obj.user_group_id = state.user_group.id;
    }

    if (state.users && state.users.length) {
      obj.user_ids = state.users.map((e) => e.id);
    }

    // TODO: Call types
    // if (state.call_types.length) {
    //   obj.call_types = state.call_types
    // }

    return obj;
  }
  /// //////////////////////////////////////////////////////////////////////////

};

export default getters;

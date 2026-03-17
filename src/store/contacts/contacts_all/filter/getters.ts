import { RootState } from '@/store';
import { State, Tag } from './state';
import { GetterTree } from 'vuex';

export interface Getters {
  tags (state: State): Tag[]
}

const getters: GetterTree<State, RootState> & Getters = {
  projects (state: State) { return state.projects; },
  statuses (state: State) { return state.statuses; },
  users (state: State) { return state.users; },
  user_groups (state: State) { return state.user_groups; },
  tags (state: State) { return state.tags; },
  timezones (state: State) { return state.timezones; },
  /// //////////////////////////////////////////////////////////////////////////
  filter_q (state: State) { return state.filter_q; },
  filter_project (state: State) { return state.filter_project; },
  filter_statuses (state: State) { return state.filter_statuses; },
  filter_owner (state: State) { return state.filter_owner; },
  filter_user_group (state: State) { return state.filter_user_group; },
  filter_tags (state: State) { return state.filter_tags; },
  filter_contact_created_at (state: State) { return state.filter_contact_created_at; },
  filter_called (state: State) { return state.filter_called; },
  filter_offset (state: State) { return state.filter_offset || 0; },
  filter_task (state) { return state.filter_task; },
  filter_timezone (state: State) { return state.filter_timezone; },

  order_by (state: State) { return state.order_by; },
  order_direction (state: State) { return state.order_direction; },
  /// //////////////////////////////////////////////////////////////////////////
  all (state: State) {
    const obj: Record<string, unknown> = {};

    if (state.filter_q) {
      obj.q = state.filter_q;
    }

    if (state.filter_project) {
      obj.project_id = state.filter_project.id;
    }

    if (state.filter_statuses && state.filter_statuses.length) {
      obj.status_ids = state.filter_statuses.map((e) => e.id);
    }

    if (state.filter_user_group) {
      obj.user_group_id = state.filter_user_group.id;
    }

    if (state.filter_owner) {
      obj.owner_id = state.filter_owner.id;
    }

    if (state.filter_task) {
      obj.task = state.filter_task;
    }

    if (state.filter_called) {
      obj.called = state.filter_called;
    }

    if (state.filter_tags && state.filter_tags.length) {
      obj.tag_ids = state.filter_tags.map((e) => e.id);
    }

    if (state.filter_timezone) {
      obj.timezone_id = state.filter_timezone.id;
    }

    if (state.filter_contact_created_at) {
      obj.contact_created_at = state.filter_contact_created_at;
    }

    if (state.filter_offset) {
      obj.offset = state.filter_offset;
    }

    if (state.order_by && state.order_direction) {
      obj.order_by = state.order_by;
      obj.order_direction = state.order_direction;
    }

    return obj;
  }
  /// //////////////////////////////////////////////////////////////////////////

};

export default getters;

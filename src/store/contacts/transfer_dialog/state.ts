export interface State {
  visible: boolean;
  available_projects: Array<Record<string, unknown>>;
  available_users: Array<Record<string, unknown>>;
  project_id: number|null;
  user_ids: number[];
}

export function defaultState () {
  return {
    visible: false,
    available_projects: [],
    available_users: [],
    project_id: null,
    user_ids: []
  }
}

const state = defaultState()

export default state

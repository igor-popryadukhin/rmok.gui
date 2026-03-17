import Project from '@/api/interfaces/Project';
import User from '@/api/interfaces/User';

export interface State {
  visible: boolean;
  available_projects: Project[];
  available_users: User[];
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
  };
}

const state = defaultState();

export default state;

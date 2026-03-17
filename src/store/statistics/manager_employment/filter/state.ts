import Project from '@/api/interfaces/Project';
import User from '@/api/interfaces/User';
import UserGroup from '@/api/interfaces/UserGroup';

export interface State {
  /// /////////////////////////////////
  period: string;
  project: Project|null;
  users: User[];
  user_group: UserGroup|null;
  call_types: string[];
  /// /////////////////////////////////
}

export function defaultState (): State {
  return {
    period: null,
    project: null,
    users: [],
    user_group: null,
    call_types: []
  };
}

export const state = defaultState;

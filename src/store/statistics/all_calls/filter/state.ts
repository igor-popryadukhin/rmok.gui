import ContactTag from '@/api/interfaces/ContactTag'
import Project from '@/api/interfaces/Project'
import Status from '@/api/interfaces/Status'
import TimeZone from '@/api/interfaces/TimeZone'
import User from '@/api/interfaces/User'
import UserGroup from '@/api/interfaces/UserGroup'

export interface State {
  /// /////////////////////////////////
  period: string|null;
  project: Project|null;
  statuses: Status[]|null;
  owner: User|null;
  user_group: UserGroup|null;
  tags: ContactTag[];
  contact_created_at: string|null;
  offset: number;
  timezone: TimeZone|null;

  order_by: string|null;
  order_direction: 'asc' | 'desc';
  /// /////////////////////////////////
}

export function defaultState (): State {
  return {
    /// /////////////////////////////////
    period: null,
    project: null,
    statuses: null,
    owner: null,
    user_group: null,
    tags: null,
    contact_created_at: null,
    offset: 0,
    timezone: null,

    order_by: '',
    order_direction: 'asc'
    /// /////////////////////////////////
  }
}

export const state = defaultState

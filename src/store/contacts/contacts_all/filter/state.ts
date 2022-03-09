import Status from '@/api/interfaces/Status'

export interface Group {
  id: number;
  name: string;
  color: string;
}

export interface Project {
  id: number;
  name: string;
}

interface UserGroup {
  id: number;
  name: string;
}

interface User {
  id: number;
  full_name: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface TimeZone {
  id: number;
  name: string;
}

export interface State {
  projects: Project[];
  statuses: Status[];
  users: User[];
  user_groups: UserGroup[];
  tags: Tag[];
  timezones: TimeZone[];
  /// /////////////////////////////////
  filter_q: string|null;
  filter_project: Project|null;
  filter_statuses: Status[]|null;
  filter_owner: User|null;
  filter_user_group: UserGroup|null;
  filter_tags: Tag[]|null;
  filter_contact_created_at: string;
  filter_called: null | 'yes' | 'no';
  filter_offset: number;
  filter_task: string|null;
  filter_timezone: TimeZone|null;

  order_by: string|null;
  order_direction: 'asc' | 'desc';
  /// /////////////////////////////////
}

export function defaultState (): State {
  return {
    projects: [],
    statuses: [],
    users: [],
    user_groups: [],
    tags: [],
    timezones: [],
    /// /////////////////////////////////
    filter_q: '',
    filter_project: null,
    filter_statuses: null,
    filter_owner: null,
    filter_user_group: null,
    filter_tags: null,
    filter_contact_created_at: '',
    filter_called: null,
    filter_offset: 0,
    filter_task: '',
    filter_timezone: null,

    order_by: '',
    order_direction: 'asc'
    /// /////////////////////////////////
  }
}

export const state = defaultState

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
  period: string;
  q: string|null;
  project_id: number;
  status_ids: number[];
  owner_id: number;
  user_group_id: number;
  tag_ids: number[];
  contact_created_at: string;
  calling: null | 'yes' | 'no';
  offset: number;
  task: string|null;
  timezone_id: number|null;

  order_by: string|null;
  order_direction: 'asc' | 'desc';
  /// /////////////////////////////////
  panel_visible: boolean;
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
    period: null,
    q: '',
    project_id: 0,
    status_ids: [],
    owner_id: 0,
    user_group_id: 0,
    tag_ids: [],
    contact_created_at: '',
    calling: null,
    offset: 0,
    task: '',
    timezone_id: null,

    order_by: '',
    order_direction: 'asc',
    /// /////////////////////////////////
    panel_visible: true
  }
}

export const state = defaultState()

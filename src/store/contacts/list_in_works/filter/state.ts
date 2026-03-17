import Status from '@/api/interfaces/Status';

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
  filter_project_id: number;
  filter_status_ids: number[];
  filter_owner_id: number;
  filter_user_group_id: number;
  filter_tag_ids: number[];
  filter_contact_created_at: string;
  filter_called: null | 'yes' | 'no';
  filter_offset: number;
  filter_task: string|null;
  filter_timezone_id: number|null;

  order_by: string|null;
  order_direction: 'asc' | 'desc';
  /// /////////////////////////////////
  filter_panel_visible: boolean;
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
    filter_project_id: 0,
    filter_status_ids: [],
    filter_owner_id: 0,
    filter_user_group_id: 0,
    filter_tag_ids: [],
    filter_contact_created_at: '',
    filter_called: null,
    filter_offset: 0,
    filter_task: '',
    filter_timezone_id: null,

    order_by: '',
    order_direction: 'asc',
    /// /////////////////////////////////
    filter_panel_visible: true
  };
}

export const state = defaultState;

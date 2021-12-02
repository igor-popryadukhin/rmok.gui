
export interface Group {
  id: number;
  name: string;
  color: string;
}

export interface Project {
  id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
  project: Project;
  group: Group;
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

export interface State {
  projects: Project[];
  statuses: Status[];
  users: User[];
  user_groups: UserGroup[];
  tags: Tag[];
  /// /////////////////////////////////
  filter_q: string|null;
  filter_project_id: number;
  filter_status_ids: number[];
  filter_owner_id: number;
  filter_user_group_id: number;
  filter_tag_ids: number[];
  filter_contact_created_at: string;
  filter_calling: null | 'yes' | 'no';
  filter_offset: number;
  filter_task: string|null;
  filter_utc_offset: number|null;
  /// /////////////////////////////////
}

export function defaultState () {
  return {
    projects: [],
    statuses: [],
    users: [],
    user_groups: [],
    tags: [],
    /// /////////////////////////////////
    filter_q: '',
    filter_project_id: 0,
    filter_status_ids: [],
    filter_owner_id: 0,
    filter_user_group_id: 0,
    filter_tag_ids: [],
    filter_contact_created_at: '',
    filter_calling: null,
    filter_offset: 0,
    filter_task: '',
    filter_utc_offset: null
    /// /////////////////////////////////
  }
}

const state = defaultState()

export default state

export interface State {
  period?: string;
  owner_id: number;
  user_group_id: number;
  status_ids: number[];
  project_id: number;
  contact_tag_ids: number[];
  contact_created_at?: string;
}

function state (): State {
  return {
    period: undefined,
    owner_id: 0,
    user_group_id: 0,
    status_ids: [],
    project_id: 0,
    contact_tag_ids: [],
    contact_created_at: undefined
  }
}

export default state

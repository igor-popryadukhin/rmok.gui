export interface State {
  period?: string;
  owner_id: number;
  user_group_id: number;
  status_ids: number[];
  project_id: number;
  contact_tag_ids: number[];
  contact_created_at?: string;
  order_by: string;
  order_direction: string;
}

function state (): State {
  return {
    period: undefined,
    owner_id: 0,
    user_group_id: 0,
    status_ids: [],
    project_id: 0,
    contact_tag_ids: [],
    contact_created_at: undefined,
    order_by: 'created_at',
    order_direction: 'asc'
  }
}

export default state

export interface State {
  filter_q: string;
  filter_project_id: number;
  filter_status_ids: number[];
  filter_user_id: number;
  filter_user_group_id: number;
  filter_tag_ids: number[];
  filter_contact_created_at: string;
  filter_calling: null | 'yes' | 'no';
  filter_offset: number;
  filter_task: string;
  order_by: string;
  order_direction: string;
}

export function defaultState () {
  return {
    filter_q: '',
    filter_project_id: 0,
    filter_status_ids: [],
    filter_user_id: 0,
    filter_user_group_id: 0,
    filter_tag_ids: [],
    filter_contact_created_at: '',
    filter_calling: null,
    filter_offset: 0,
    filter_task: '',
    order_by: 'by_name',
    order_direction: 'asc'
  }
}

const state = defaultState()

export default state

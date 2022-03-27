export interface State {
  // Фильтр
  filter_q: string;
  filter_status_id: number;
  filter_state: 'pending'|'done';
  filter_planned_for: string;
  filter_offset: number;
}

export function defaultState (): State {
  return {
    filter_q: '',
    filter_status_id: 0,
    filter_state: 'pending',
    filter_planned_for: '',
    filter_offset: 0
  }
}

export const state = defaultState

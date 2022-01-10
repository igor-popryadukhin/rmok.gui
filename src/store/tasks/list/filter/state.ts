import Status from '@/api/interfaces/Status'

export interface State {
  // Фильтр
  filter_q: string;
  filter_status_id: number;
  filter_planned_for: string;

  statuses: Status[]
}

export function defaultState (): State {
  return {
    filter_q: '',
    filter_status_id: 0,
    filter_planned_for: '',

    statuses: []
  }
}

export const state = defaultState

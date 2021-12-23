import Scenario from '@/api/interfaces/Scenario'

export interface State {
  items: Scenario[];
  total: number;
  per_page: number;
  filter_offset: number;
}

function state (): State {
  return {
    items: [],
    total: 0,
    per_page: 50,
    filter_offset: 0
  }
}

export default state

import Autodialer from '@/api/interfaces/Autodialer'

export interface State {
  fetch_process: boolean;
  params: Autodialer[];
  total: number;
  filter_offset: number;
}

function state (): State {
  return {
    fetch_process: false,
    params: [],
    total: 0,
    filter_offset: 0
  }
}

export default state

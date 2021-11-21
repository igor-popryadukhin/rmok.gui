import Autodialer from '@/api/interfaces/Autodialer'

export interface State {
  items: Autodialer[];
  total: number;
}

function state (): State {
  return {
    items: [],
    total: 0
  }
}

export default state

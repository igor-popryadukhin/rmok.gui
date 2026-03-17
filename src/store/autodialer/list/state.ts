import Autodialer from '@/api/interfaces/Autodialer';

export interface State {
  items_fetching: boolean;
  items: Autodialer[];
  total: number;
}

function state (): State {
  return {
    items_fetching: false,
    items: [],
    total: 0
  };
}

export default state;

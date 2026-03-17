import Status from '@/api/interfaces/Status';

export interface StatusesState {
  items_fetching: boolean;
  items: Status[];
}

function state (): StatusesState {
  return {
    items_fetching: false,
    items: []
  };
}

export default state;

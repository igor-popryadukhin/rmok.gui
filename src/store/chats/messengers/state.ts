import { Messengers } from '@/api/interfaces/Messengers'

export interface State {
  fetching: boolean;
  items: Messengers[];
}

function state (): State {
  return {
    fetching: false,
    items: []
  }
}

export default state

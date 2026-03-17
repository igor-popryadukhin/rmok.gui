import Notification from '@/api/interfaces/Notification';

export interface State {
  visible: boolean;
  count: number;
  items: Notification[];
}

function state (): State {
  return {
    visible: false,
    count: 0,
    items: []
  };
}

export default state;

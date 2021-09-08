import Notification from '@/api/interfaces/Notification'

export interface State {
  notifications_visible: boolean;
  notifications_count: number;
  notifications: Notification[];
}

function state (): State {
  return {
    notifications_visible: false,
    notifications_count: 0,
    notifications: []
  }
}

export default state

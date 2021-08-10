import User from './User'

export default interface Notification {
  id: number;
  message: string;
  owner: User;
  priority: string;
  created_at: number;
}

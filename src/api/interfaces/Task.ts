import Contact from './Contact'
import User from './User'

export default interface Task {
  id: number;
  performer: User;
  type: string;
  description: string;
  state: 'done' | 'pending';
  expired: boolean;
  planned_for: number;
  author: User;
  contact?: Contact;
  created_at: number;
}

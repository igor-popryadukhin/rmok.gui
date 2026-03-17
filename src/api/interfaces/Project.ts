import Status from '@/api/interfaces/Status';
import User from './User';

export default interface Project {
  id: number;
  name: string;
  description: string;
  owner?: User;
  members?: User[];
  statuses?: Status[];
  scenario?: string;
  created_at: number;
}

import User from './User'
import StatusGroup from './StatusGroup'

export default interface Project {
  id: number;
  name: string;
  description: string;
  owner?: User;
  members?: User[];
  statuses?: StatusGroup[];
  scenario?: string;
  created_at: number;
}

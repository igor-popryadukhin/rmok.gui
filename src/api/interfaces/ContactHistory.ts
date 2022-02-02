import Project from './Project'
import User from './User'

export default interface ContactHistory {
  id: number;
  owner?: User;
  status?: Project;
  project?: Project;
  comment?: string;
  [keys: string]: any;
}

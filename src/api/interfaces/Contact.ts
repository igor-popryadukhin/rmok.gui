import User from './User'
import ContactTag from './ContactTag'
import ContactEmail from './ContactEmail'
import Project from './Project'
import ContactPhone from './ContactPhone'

export default interface Contact {
  id: number;
  name: string;
  city?: string;
  region?: string;
  address?: string;
  default_phone?: ContactPhone;
  project?: Project;
  status?: any;
  owner?: User;
  emails?: ContactEmail[];
  phones?: ContactPhone[];
  tags?: ContactTag[]
  created_at: number;
  notes?: string;
  last_call_at?: number;
  tz?: string;
}

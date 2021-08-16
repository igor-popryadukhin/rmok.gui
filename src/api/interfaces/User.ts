import Organization from '@/api/interfaces/Organization'
import Project from '@/api/interfaces/Project'
import Role from '@/api/interfaces/Role'
import PBXConfig from './PBXConfig'
import UserGroup from './UserGroup'
import Country from './Country'

export default interface User {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  full_name?: string;
  userpic?: string;
  online: boolean;
  last_activity_at?: number;
  abbreviation?: string;
  login: string;
  email: string;
  phone: string;
  group?: UserGroup;
  role: Role; // TODO: Типизировать срочно!
  roles: Role[];
  organization?: Organization;
  project?: Project;
  projects?: Project[];
  pbx_config?: PBXConfig;
  country?: Country;
}

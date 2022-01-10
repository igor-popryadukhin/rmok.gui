import Organization from './Organization'
import Project from './Project'
import Role from './Role'
import UserGroup from './UserGroup'
import Country from './Country'
import PBXConfiguration from './PBXConfiguration'

export default interface User {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  full_name: string;
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
  pbx_configuration?: PBXConfiguration;
  permissions?: Array<Record<string, unknown>>;
  country?: Country;
  tz?: string;
  status?: string;
  mode?: string;
}

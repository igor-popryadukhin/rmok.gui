import Status from '@/api/interfaces/Status'
import Project from '@/api/interfaces/Project'
import TimeZone from '@/api/interfaces/TimeZone'
import User from '@/api/interfaces/User'
import UserGroup from '@/api/interfaces/UserGroup'
import ContactTag from '@/api/interfaces/ContactTag'
import Role from '@/api/interfaces/Role'

export interface State {
  contact_tags: ContactTag[];
  statuses: Status[];
  projects: Project[];
  users: User[];
  users_groups: UserGroup[];
  roles: Role[];
  timezone: TimeZone[];
}

function state (): State {
  return {
    contact_tags: [],
    statuses: [],
    projects: [],
    users: [],
    users_groups: [],
    roles: [],
    timezone: []
  }
}

export default state

import Status from '@/api/interfaces/Status'
import Project from '@/api/interfaces/Project'
import User from '@/api/interfaces/User'
import UserGroup from '@/api/interfaces/UserGroup'
import ContactTag from '@/api/interfaces/ContactTag'

export interface FilterState {
  contact_tags: ContactTag[];
  statuses: Status[];
  projects: Project[];
  users: User[];
  users_groups: UserGroup[];
}

function state (): FilterState {
  return {
    contact_tags: [],
    statuses: [],
    projects: [],
    users: [],
    users_groups: []
  }
}

export default state

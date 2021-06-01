import { ContactTagInterface } from '@/api/Schemas/ContactInterface'

export interface StatusInterface {
  id: number;
  name: string;
  color: string;
  project_name?: string;
}

export interface FilterStateInterface {
  contact_tags: ContactTagInterface[],
  statuses: ContactTagInterface[]
}

function state (): FilterStateInterface {
  return {
    contact_tags: [],
    statuses: []
  }
}

export default state

import { ContactTagInterface } from '@/api/Schemas/ContactInterface'

export interface FilterStateInterface {
  contact_tags: ContactTagInterface[]
}

function state (): FilterStateInterface {
  return {
    contact_tags: []
  }
}

export default state

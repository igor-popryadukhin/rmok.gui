import { ProjectInterface } from '@/api/Projects'

export interface ProjectStateInterface {
  id: number;
  name: string;
  scenario: string;
  statuses: any[];
  created_at: number;
  available_count: number;
  available: ProjectInterface[]
}

function state (): ProjectStateInterface {
  return {
    id: 0,
    name: '',
    scenario: '',
    statuses: [],
    created_at: 0,
    available_count: 0,
    available: []
  }
}

export default state

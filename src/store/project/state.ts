
export interface ProjectStateInterface {
  id: number;
  name: string;
  scenario: string;
  statuses: any[];
  created_at: number;
}

function state (): ProjectStateInterface {
  return {
    id: 0,
    name: '',
    scenario: '',
    statuses: [],
    created_at: 0
  }
}

export default state

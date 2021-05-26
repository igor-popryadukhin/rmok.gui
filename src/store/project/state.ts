
export interface CurrentProjectInterface {
  id: number;
  name: string;
  scenario: string;
  statuses: any[];
  created_at: number;
}

export interface ProjectStateInterface {
  current?: CurrentProjectInterface;
  available: CurrentProjectInterface[];
}

function state (): ProjectStateInterface {
  return {
    current: undefined,
    available: []
  }
}

export default state

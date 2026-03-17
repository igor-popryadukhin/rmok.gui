import User from '@/api/interfaces/User';
import StatusGroup from '@/api/interfaces/StatusGroup';

export interface State {
  id: number;
  name: string;
  description: string;
  owner?: User;
  members?: User[];
  statuses?: StatusGroup[];
  scenario?: string;
  created_at: number;
}

export function defaultState (): State {
  return {
    id: 0,
    created_at: 0,
    description: '',
    members: [],
    name: '',
    owner: undefined,
    scenario: '',
    statuses: []
  };
}

const state = defaultState();

export default state;

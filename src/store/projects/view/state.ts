import Status from '@/api/interfaces/Status';

export interface ProjectsViewState {
  fetching: boolean;

  project_name: string;
  project_description: string;
  project_scenario: string;
  project_statuses: Status[];
  project_queue_number: string|null;
}

export function defaultState (): ProjectsViewState {
  return {
    fetching: false,

    project_name: '',
    project_description: '',
    project_scenario: '',
    project_statuses: [],
    project_queue_number: null
  };
}

const state = defaultState;

export default state;

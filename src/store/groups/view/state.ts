import Status from '@/api/interfaces/Status';

export interface ProjectsViewState {
  fetching: boolean;

  project_name: string;
  project_description: string;
  project_scenario: string;
  project_statuses: Status[];
}

export function defaultState (): ProjectsViewState {
  return {
    fetching: false,

    project_name: '',
    project_description: '',
    project_scenario: '',
    project_statuses: []
  };
}

const state = defaultState;

export default state;

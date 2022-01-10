export interface ProjectsViewState {
  fetching: boolean;

  project_name: string;
  project_description: string;
  project_scenario: string;
}

export function defaultState (): ProjectsViewState {
  return {
    fetching: false,

    project_name: '',
    project_description: '',
    project_scenario: ''
  }
}

const state = defaultState

export default state

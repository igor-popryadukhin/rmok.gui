export interface ScenarioViewState {
  id: number;
  name: string;
  description: string;
  scenario: string;
}

function state (): ScenarioViewState {
  return {
    id: 0,
    name: '',
    description: '',
    scenario: ''
  };
}

export default state;

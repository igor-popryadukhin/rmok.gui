export interface State {
  id: number;
  name: string;
  scenario: string;
}

function state (): State {
  return {
    id: 0,
    name: '',
    scenario: ''
  }
}

export default state

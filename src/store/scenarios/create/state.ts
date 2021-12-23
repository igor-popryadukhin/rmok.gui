export interface State {
  name: string;
  scenario: string;
}

function state (): State {
  return {
    name: '',
    scenario: ''
  }
}

export default state

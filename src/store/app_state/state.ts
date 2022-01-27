export interface State {
  action: string;
}

function state (): State {
  return {
    action: ''
  }
}

export default state

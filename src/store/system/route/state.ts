export interface State {
  full_path?: string;
}

function state (): State {
  return {
    full_path: undefined
  }
}

export default state

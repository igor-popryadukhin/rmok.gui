
export interface State {
  [keys: string]: unknown;
}

function defaultState (): State {
  return {}
}

export default defaultState

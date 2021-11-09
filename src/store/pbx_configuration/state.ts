
export interface State {
  [keys: string]: any;
}

function defaultState (): State {
  return {}
}

export default defaultState

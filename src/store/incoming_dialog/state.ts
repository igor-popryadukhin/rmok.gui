export interface State {
  visible: boolean;
}

function defaultState (): State {
  return {
    visible: false
  }
}

export default defaultState

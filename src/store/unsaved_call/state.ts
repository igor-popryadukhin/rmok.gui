export interface State {
  unsaved: boolean;
}

function state (): State {
  return {
    unsaved: false
  }
}

export default state

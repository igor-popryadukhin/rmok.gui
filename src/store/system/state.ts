
export interface State {
  permissions: Array<Record<string, any>>;
}

function state (): State {
  return {
    permissions: []
  }
}

export default state

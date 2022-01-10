
export interface State {
  permissions: Array<Record<string, unknown>>;
}

function state (): State {
  return {
    permissions: []
  }
}

export default state

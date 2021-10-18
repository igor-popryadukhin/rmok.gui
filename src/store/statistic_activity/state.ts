
export interface State {
  activity: any[];
}

export function defaultState (): State {
  return {
    activity: []
  }
}

const state = defaultState()

export default state

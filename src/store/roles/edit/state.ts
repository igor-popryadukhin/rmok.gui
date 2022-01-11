
export interface State {
  fetching: boolean;
  /// //////////////////////
  role_name: string;
  role_permissions: Array<Record<string, unknown>>;
}

function defaultState (): State {
  return {
    fetching: false,
    role_name: '',
    role_permissions: []
  }
}

export default defaultState

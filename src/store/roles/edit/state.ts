import RolePermission from '@/api/interfaces/RolePermission'

export interface State {
  fetching: boolean;
  /// //////////////////////
  role_name: string;
  role_permissions: RolePermission[];
}

function defaultState (): State {
  return {
    fetching: false,
    role_name: '',
    role_permissions: []
  }
}

export default defaultState

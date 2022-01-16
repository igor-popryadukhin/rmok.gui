import RolePermission from './RolePermission'

export default interface Role {
  id: number;
  name: string;
  permissions?: RolePermission[];
}

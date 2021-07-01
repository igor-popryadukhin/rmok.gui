export default interface UserInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  login: string;
  email: string;
  phone: string;
  role?: RoleInterface;
  group?: GroupInterface;
  organization?: UserOrganizationInterface;
  project?: ProjectInterface;
  projects?: ProjectInterface[];
  pbx_config?: PBXInterface;
}

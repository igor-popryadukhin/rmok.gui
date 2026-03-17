import User from './User';

export default interface UserGroup {
  id: number;
  name: string;
  responsible?: User;
}

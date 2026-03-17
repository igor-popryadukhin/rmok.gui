import Status from './Status';

export default interface StatusGroup {
  id: number;
  name: string;
  color: string;
  children: Status[];
}

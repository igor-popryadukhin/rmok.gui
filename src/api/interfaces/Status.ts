import StatusAction from './StatusAction'

export default interface Status {
  id: number;
  name: string;
  color?: string;
  actions?: StatusAction[];
}

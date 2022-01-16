export default interface AutodialerCall {
  id: number;
  attempts_left: number
  contact: { id: number, name: string }
  is_calling: boolean;
  last_call_at: string|null;
  last_status: { id: number, name: string, color: string }
  next_call_at: string|null;
  progress: 'init'|'process'|'complete';
  external_status: string;
  internal_status: string;
  created_at: string|null;
  you_can_call: boolean;
}

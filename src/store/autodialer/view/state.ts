export interface State {
  id: number;
  name: string;
  status: string;
  mode: string;
  call_back_in_minutes: number;
  count_of_call_lines: number;
}

function state (): State {
  return {
    id: 0,
    name: '',
    status: 'ready',
    mode: '',
    call_back_in_minutes: 0,
    count_of_call_lines: 0
  }
}

export default state

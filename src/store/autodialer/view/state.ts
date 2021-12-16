export interface State {
  id: number;
  name: string;
  status: string;
  mode: string;
  call_back_in_minutes: number;
  count_of_call_lines: number;
  maximum_attempts: number;
  repeat_calls_settings_available_actions: Array<Record<string, any>>;
  repeat_calls_settings: Array<Record<string, any>>;
}

function state (): State {
  return {
    id: 0,
    name: '',
    status: 'ready',
    mode: '',
    call_back_in_minutes: 0,
    count_of_call_lines: 0,
    maximum_attempts: 0,
    repeat_calls_settings_available_actions: [],
    repeat_calls_settings: []
  }
}

export default state

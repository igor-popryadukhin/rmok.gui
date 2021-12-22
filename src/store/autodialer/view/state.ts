export interface State {
  id: number;
  name: string;
  status: string;
  mode: string;
  queue_name: string;
  pickup_timeout: number;
  max_calls_number: number;
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
    queue_name: '',
    pickup_timeout: 0,
    max_calls_number: 0,
    maximum_attempts: 0,
    repeat_calls_settings_available_actions: [],
    repeat_calls_settings: []
  }
}

export default state

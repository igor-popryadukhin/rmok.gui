export interface State {
  dialer_state: 'idle' | 'connecting' | 'accepted' | 'progress';
  page: string;
}

function state (): State {
  return {
    dialer_state: 'idle',
    page: ''
  }
}

export default state

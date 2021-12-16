export interface State {
  dialer_state: 'idle' | 'connecting' | 'accepted' | 'progress';
  dialer_connected: boolean;
  dialer_registered: boolean;
  page: string;
}

function state (): State {
  return {
    dialer_state: 'idle',
    dialer_connected: false,
    dialer_registered: false,
    page: ''
  }
}

export default state

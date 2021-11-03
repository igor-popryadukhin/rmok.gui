export interface State {
  dialer_state: 'idle' | 'connecting' | 'accepted' | 'progress';
}

function state (): State {
  return {
    dialer_state: 'idle'
  }
}

export default state

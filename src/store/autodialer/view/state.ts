export interface State {
  id: number;
  name: string;
  status: string;
}

function state (): State {
  return {
    id: 0,
    name: '',
    status: 'ready'
  }
}

export default state

export interface State {
  server: string;
  port: number;
  schema: string;
  display_name: string;
  login: string;
  password: string;
}

function state (): State {
  return {
    display_name: '',
    login: '',
    password: '',
    port: 443,
    schema: 'wss',
    server: ''
  }
}

export default state

import {Messengers} from "@/api/interfaces/Messengers";

export interface State {
  fetching: boolean;
  id: number;
  account_phone: string;
  api_id: string;
  api_hash: string;
  messenger: Messengers|null
}

function state (): State {
  return {
    fetching: false,
    id: 0,
    account_phone: '',
    api_id: '',
    api_hash: '',
    messenger: {
      id: 0,
      name: ''
    }
  }
}

export default state

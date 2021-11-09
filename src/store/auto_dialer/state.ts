import Autodialer from '@/api/interfaces/Autodialer'

export interface State {
  fetch_process: boolean
  params: Autodialer[];
}

function state (): State {
  return {
    fetch_process: false,
    params: []
  }
}

export default state

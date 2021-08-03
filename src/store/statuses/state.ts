import Status from '@/api/interfaces/Status'

export interface StatusesState {
  items: Status[]
}

function state (): StatusesState {
  return {
    items: []
  }
}

export default state

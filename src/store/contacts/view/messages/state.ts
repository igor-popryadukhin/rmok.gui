import ContactHistory from '@/api/interfaces/ContactHistory'

export interface ContactsViewMessagesState {
  items_fetching: boolean;
  items: ContactHistory[];
}

export function defaultState (): ContactsViewMessagesState {
  return {
    items_fetching: false,
    items: []
  }
}

const state = defaultState

export default state

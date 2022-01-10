import ContactHistory from '@/api/interfaces/ContactHistory'

export interface ContactsViewHistoryState {
  items_fetching: boolean;
  items_count: number;
  items: ContactHistory[];
}

export function contactsViewState (): ContactsViewHistoryState {
  return {
    items_fetching: false,
    items_count: 0,
    items: []
  }
}

const state = contactsViewState()

export default state

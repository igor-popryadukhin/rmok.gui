export interface ContactsIncomingState {
  fetching: boolean;
  // Данные контакта
  contact_id: number;
  contact_name: string;
  contact_city: string;
  contact_region: string;
  contact_tz: string;
  contact_created_at: string;
}

export function contactsIncomingState (): ContactsIncomingState {
  return {
    fetching: false,
    // Данные контакта
    contact_id: 0,
    contact_name: '',
    contact_city: '',
    contact_region: '',
    contact_tz: '',
    contact_created_at: ''
  }
}

const state = contactsIncomingState()

export default state

import ContactDetail from '@/api/interfaces/ContactDetail'
import ContactTag from '@/api/interfaces/ContactTag'
import Location from '@/api/interfaces/Location'
import StatusGroup from '@/api/interfaces/StatusGroup'
import Messenger from '@/interfaces/Messenger'

export interface ContactsViewState {
  fetching: boolean;
  // Данные контакта
  contact_id: number;
  contact_name: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_middle_name: string;
  contact_tags: ContactTag[];
  contact_owner_id: number;
  contact_owner_full_name: string;
  contact_project_id: number;
  contact_project_name: string;
  contact_project_statuses: StatusGroup[];
  contact_project_scenario: string;
  contact_details: ContactDetail[];
  contact_details_default: ContactDetail|null;
  contact_tz: string;
  contact_created_at: string;
  contact_location: Location;
  contact_allow_call: boolean;
  messenger_available: boolean;
  messenger: Messenger|null;
}

export function contactsViewState (): ContactsViewState {
  return {
    fetching: false,
    // Данные контакта
    contact_id: 0,
    contact_name: '',
    contact_first_name: '',
    contact_last_name: '',
    contact_middle_name: '',
    contact_tags: [],
    contact_owner_id: 0,
    contact_owner_full_name: '',
    contact_project_id: 0,
    contact_project_name: '',
    contact_project_statuses: [],
    contact_project_scenario: '',
    contact_details: [],
    contact_details_default: null,
    contact_tz: '',
    contact_created_at: '',
    contact_location: {
      city: '—',
      region: '—'
    },
    contact_allow_call:  false,

    // Мессенджер
    messenger_available: false,
    messenger: null
  }
}

const state = contactsViewState

export default state

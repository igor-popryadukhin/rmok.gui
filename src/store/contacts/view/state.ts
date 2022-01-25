import ContactDetail from '@/api/interfaces/ContactDetail'
import ContactEmail from '@/api/interfaces/ContactEmail'
import ContactPhone from '@/api/interfaces/ContactPhone'
import ContactTag from '@/api/interfaces/ContactTag'
import StatusGroup from '@/api/interfaces/StatusGroup'

export interface ContactsViewState {
  fetching: boolean;
  contact_id: number;
  contact_name: string;
  contact_tags: ContactTag[];
  contact_owner_id: number;
  contact_owner_full_name: string;
  contact_project_id: number;
  contact_project_name: string;
  contact_project_statuses: StatusGroup[];
  contact_project_scenario: string;
  contact_scenario_id: number;
  contact_scenario_content: string;
  contact_details: ContactDetail[];
  contact_phones: ContactPhone[];
  contact_emails: ContactEmail[];
  contact_default_phone_number: string;
  contact_city: string;
  contact_region: string;
  contact_tz: string;
  contact_created_at: string;
}

export function contactsViewState (): ContactsViewState {
  return {
    fetching: false,
    contact_id: 0,
    contact_name: '',
    contact_tags: [],
    contact_owner_id: 0,
    contact_owner_full_name: '',
    contact_project_id: 0,
    contact_project_name: '',
    contact_project_statuses: [],
    contact_project_scenario: '',
    contact_scenario_id: 0,
    contact_scenario_content: '',
    contact_details: [],
    contact_phones: [],
    contact_emails: [],
    contact_default_phone_number: '',
    contact_city: '',
    contact_region: '',
    contact_tz: '',
    contact_created_at: ''
  }
}

const state = contactsViewState()

export default state

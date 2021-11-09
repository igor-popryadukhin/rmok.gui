interface Owner {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface Phone {
  id: number;
  country_calling_code: string;
  country_code: string;
  international: string;
  label: string;
  raw: string;
}

interface Email {
  id: number;
  label: string;
  value: string;
}

interface Project {
  id: number;
  name: string;
  scenario: string;
  statuses: []
}

export interface State {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  contact_name: string;
  city?: string;
  region?: string;
  address?: string;
  tz: string;
  emails: Email[];
  phones: Phone[];
  tags: Tag[];
  owner?: Owner;
  project?: Project;
  notes?: string;
  default_phone?: Phone;
  created_at: number;
}

function defaultState (): State {
  return {
    id: 0,
    first_name: '',
    last_name: '',
    middle_name: '',
    contact_name: '',
    city: '',
    region: '',
    address: '',
    tz: '',
    emails: [],
    phones: [],
    tags: [],
    owner: null,
    project: null,
    notes: '',
    default_phone: null,
    created_at: 0
  }
}

export default defaultState

import { ProjectInterface } from '@/api/Projects';
import { UserInterface } from '@/api/Users';

export interface ContactTagInterface {
  id: number;
  name: string;
  color: string;
}

export interface ContactEmailInterface {
  id: number;
  label?: string;
  value: string;
}

export interface ContactPhoneInterface {
  id: number;
  label: string;
  raw: string;
  international: string;
  country_code: string;
  country_calling_code: string;
}

export interface ContactInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  city?: string;
  region?: string;
  address?: string;
  default_phone?: ContactPhoneInterface;
  project?: ProjectInterface;
  user?: any;
  emails: ContactEmailInterface[];
  phones: ContactPhoneInterface[];
  tags: ContactTagInterface[]
  current_date_time: number;
  created_at: number;
  notes?: string;
  last_call_at: number | null;
  tz?: string;
}

export interface ContactHistoryInterface {
  id: number;
  direction: number;
  duration: number;
  start_time: number;
  end_time: number;
  creator?: UserInterface & { is_deleted: boolean }
}

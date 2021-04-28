import { ProjectInterface } from '@/api/Projects'

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
  middle_name: string;
  city: string;
  region: string;
  address: string;
  default_phone?: ContactPhoneInterface;
  project?: ProjectInterface;
  user: any;
  emails: any[];
  phones: ContactPhoneInterface[];
  current_date_time: number;
  created_at: number;
  last_call_at: number | null;
  tz?: string;
}

export interface HistoryInterface {
  id: number;
  direction: number;
  duration: number;
  start_time: number;
  end_time: number;
}

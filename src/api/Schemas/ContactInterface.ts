import { PhoneNumberInterface } from '@/api/Schemas/PhoneNumberInterface'

export interface ContactInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  city: string;
  default_phone?: PhoneNumberInterface;
  user: any;
  emails: any[];
  phones: ContactPhoneInterface[];
}

export interface ContactPhoneInterface {
  id: number;
  label: string;
  value: {
    e164: string;
    international: string;
  } | string;
  country_code: string;
  country_calling_code: string;
}

export interface HistoryInterface {
  id: number;
  direction: number;
  duration: number;
  start_time: number;
  end_time: number;
}

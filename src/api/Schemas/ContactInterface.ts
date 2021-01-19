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
  user: any;
  emails: any[];
  phones: ContactPhoneInterface[];
  created_at: number;
}

export interface HistoryInterface {
  id: number;
  direction: number;
  duration: number;
  start_time: number;
  end_time: number;
}

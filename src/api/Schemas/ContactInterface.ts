export interface ContactInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  city: string;
  phone_number_default: PhoneDefaultInterface;
  user: any;
}

export interface PhoneDefaultInterface {
  value: string;
  type: string;
}

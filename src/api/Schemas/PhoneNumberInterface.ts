export interface PhoneNumberInterface {
  id: number;
  country_code: string;
  country_calling_code: string;
  label: string;
  value: ValueInterface;
}

interface ValueInterface {
  e164: string;
  international: string;
}

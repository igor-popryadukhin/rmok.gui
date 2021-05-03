export interface PhoneInterface {
  id?: number;
  value?: string;
  label?: string;
}

export interface EmailInterface {
  id?: number;
  value: string;
  label: string;
}

export interface TagInterface {
  id?: number;
  name: string;
  color: string;
}

export interface ContactInterface {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  city?: string;
  region?: string;
  address?: string;
  emails?: EmailInterface[];
  phones?: PhoneInterface[];
  notes?: string;
  tags?: TagInterface[]
  created_at?: number
}

export interface EventInterface {
  /**
   *
   * @param data Данные контакта.
   * @param resolve Разрешает обещание.
   */
  save: (data: ContactInterface) => void;
  /**
   * Происходит при нажатии кнопки Отмена
   */
  cancel: () => void;
}

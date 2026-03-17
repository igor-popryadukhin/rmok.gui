import Contact from '@/api/interfaces/Contact';

export interface ContactsListState {
  error: boolean;
  error_text: string;
  loading: boolean;
  per_page: number;
  items: Contact[];
  items_total: number;
  items_selected: number[];
  selected_all: boolean;
}

export function defaultState (): ContactsListState {
  return {
    error: false,
    error_text: '',
    loading: false,
    per_page: 100,
    items: [],
    items_total: 0,
    items_selected: [],
    selected_all: false
  };
}

const state = defaultState();

export default state;

import Task from '@/api/interfaces/Task';

export interface ContactsViewTasksState {
  items_fetching: boolean;
  items_count: number;
  items: Task[];
}

export function contactsViewState (): ContactsViewTasksState {
  return {
    items_fetching: false,
    items_count: 0,
    items: []
  };
}

const state = contactsViewState();

export default state;

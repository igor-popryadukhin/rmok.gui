import { TaskInterface } from '@/api/Tasks'

interface OptionsInterface {
  count: number;
  page: number;
  pages: number;
  per_page: number;
}

interface FilterInterface {
  contact_id: number;
  q: string | null;
  sort: string | null;
  status_id: number;
  state: string | null;
  planned_for: string | null;
}

export interface TasksStateInterface {
  /** Общее количество задач текущего пользователя в статусе pending */
  pending_count: number;
  options: OptionsInterface,
  filter: FilterInterface,
  items: TaskInterface[];
}

function state (): TasksStateInterface {
  return {

    // Параметры запроса (сохраняются между перезагрузками страниц)
    filter: {
      contact_id: 0,
      planned_for: null,
      q: '',
      sort: '',
      state: '',
      status_id: 0
    },

    // Элементы задач
    items: [],

    // Опции страницы
    options: {
      count: 0,
      page: 1,
      pages: 1,
      per_page: 25
    },

    pending_count: 0
  }
}

export default state

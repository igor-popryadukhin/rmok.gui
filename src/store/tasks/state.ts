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
    pending_count: 0,
    // Опции страницы
    options: {
      count: 0,
      page: 1,
      pages: 1,
      per_page: 25
    },
    // Параметры запроса (сохраняются между перезагрузками страниц)
    filter: {
      contact_id: 0,
      q: '',
      sort: '',
      status_id: 0,
      state: '',
      planned_for: null
    },
    // Элементы задач
    items: []
  }
}

export default state

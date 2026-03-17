export interface State {
  /**
   * Идентификатор истории контакта
   */
  contact_history_id: number;
  /**
   * Идентификатор контакта
   */
  contact_id: number;
  contact_name: string;
  /**
   * Идентификатор звонка
   */
  call_id?: string|number;
  direction?: 'incoming'|'outgoing';
  /**
   * Выбранный статус
   */
  status_id: number;
  /**
   * Комментарий
   */
  comment: string;
}

function state (): State {
  return {
    contact_history_id: 0,
    contact_id: 0,
    contact_name: '',
    call_id: null,
    direction: null,
    status_id: 0,
    comment: ''
  };
}

export default state;

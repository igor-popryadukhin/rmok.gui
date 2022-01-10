export interface UnsavedCallState {
  persists: boolean;
  unsaved: boolean;

  /// ///////////////////////////////////
  data_contact_history_id: number;
  data_contact_id: number;
  data_contact_name: string;
  data_call_id?: string|number;
  data_direction?: 'incoming'|'outgoing';
  data_status_id: number;
  data_comment: string;
  /// ///////////////////////////////////
}

function unsavedCallState (): UnsavedCallState {
  return {
    data_call_id: undefined,
    data_comment: '',
    data_contact_history_id: 0,
    data_contact_id: 0,
    data_contact_name: '',
    data_direction: undefined,
    data_status_id: 0,
    persists: false,
    unsaved: false
  }
}

export default unsavedCallState

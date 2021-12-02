export interface State {
  dialog_visible: boolean;
  field_first_name?: string;
  field_last_name?: string;
  field_middle_name?: string;
}

export function defaultState (): State {
  return {
    dialog_visible: false,
    /// FIELDS ///
    field_first_name: null,
    field_last_name: null,
    field_middle_name: null
    /// FIELDS ///
  }
}

const state = defaultState()

export default state

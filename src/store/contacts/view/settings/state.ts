export interface ContactsViewSettingsState {
  left_width: number;
  right_width: number;
}

export function contactsViewSettingsState (): ContactsViewSettingsState {
  return {
    left_width: 280,
    right_width: 400
  }
}

const state = contactsViewSettingsState()

export default state

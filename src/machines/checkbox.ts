import { Machine } from 'xstate'

export const checkboxMachine = Machine({
  id: 'checkbox',
  context: {
    state: ''
  },
  initial: 'inactive',
  states: {
    inactive: {
      entry (context) {
        context.state = 'inactive'
      },
      on: { ACTIVE: 'active' }
    },
    active: {
      entry (context) {
        context.state = 'active'
      },
      on: { INACTIVE: 'inactive' }
    },
    indeterminate: {
      entry (context) {
        context.state = 'indeterminate'
      },
      on: { INDETERMINATE: 'inactive' }
    }
  }
})

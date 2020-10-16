import Vue from 'vue'
import { uaMachine, uaServices } from '@/jsSIP/jsSIPMachine'

/* eslint-disable */
Vue.mixin(Vue.extend({
  data () {
    return {
      uaServices,
      uaMachineCurrentState: uaMachine.initialState
    }
  },

  methods: {

    /**
     * Fires when the call button is pressed
     * @param contact_id
     * @param target
     */
    onCall (contact_id: number, target: string) {
      this.uaServices.send('CALL', { target, contact_id })
    },

    /**
     * Fires when the end call button is pressed.
     */
    onCancelCall () {
      this.uaServices.send('CANCEL')
    }
  }
}))

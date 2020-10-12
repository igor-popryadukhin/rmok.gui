import Vue from 'vue'
import { RTCSession } from 'jssip/lib/RTCSession'
import { uaMachine, uaServices } from '@/jsSIP/jsSIPMachine'
import { State } from 'xstate/lib/State'

/* eslint-disable */
export default Vue.extend({
  data () {
    return {
      uaServices,
      uaMachineCurrentState: uaMachine.initialState,
      jsSip: {
        color: null,
        currentSession: null as RTCSession | null,
        connecting: false
      }
    }
  },

  created () {
    this.uaServices.onTransition((state: State<any, any, any, any>) => {
      console.log('onTransition: ', state.value)
      this.uaMachineCurrentState = state
    })
  },

  methods: {

    /**
     * Fires when the call button is pressed
     * @param target
     */
    onCall (target: string) {
      this.uaServices.send('CALL', { target })
    },

    /**
     * Fires when the end call button is pressed.
     */
    onCancelCall () {
      this.uaServices.send('CANCEL')
    }
  }
})

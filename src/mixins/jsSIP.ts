import Vue from 'vue'
import { ContextUAStateInterface, directionToNum } from '@/jsSIP/jsSIPMachine'
import { HistoryInterface } from '@/api/Schemas/ContactInterface'
import { Contacts } from '@/api/Contacts'
import { POSITION } from 'vue-toastification'

/* eslint-disable */
export default Vue.extend({
  data () {
    return {
      contactHistory: [] as HistoryInterface[]
    }
  },

  mounted () {
    this.$root.$on('jssip-session-cancel', this.onJsSIPSessionCancel)
    this.$root.$on('jssip-session-ended', this.onJsSIPSessionEnded)
    this.$root.$on('jssip-session-failed', this.onJsSIPSessionFailed)
  },

  destroyed () {
    this.$root.$off('jssip-session-cancel', this.onJsSIPSessionCancel)
    this.$root.$off('jssip-session-ended', this.onJsSIPSessionEnded)
    this.$root.$off('jssip-session-failed', this.onJsSIPSessionFailed)
  },

  methods: {

    loadHistory (contact_id: number) {
      new Contacts()
        .getHistory(contact_id)
        .then((history: any) => {
          this.contactHistory = history.items
        })
    },

    onJsSIPSessionCancel (context: ContextUAStateInterface) {
      // @ts-ignore
      if (this.uaMachineCurrentState.value !== 'accepted') {
        new Contacts()
          .addHistory(context.contact_id, {
            direction: directionToNum(context.session.direction + '_canceled'),
            target: context.target
          }).then(() => {
          this.loadHistory(context.contact_id)
        })
      }
    },

    onJsSIPSessionEnded (context: ContextUAStateInterface) {
      let data = {}
      if (context.session.start_time && context.session.end_time) {
        data = {
          start_timestamp: context.session.start_time.getTime() / 1000,
          end_timestamp: context.session.end_time.getTime() / 1000
        }
      }
      new Contacts()
        .addHistory(context.contact_id, {
          direction: directionToNum(context.session.direction),
          ...data,
          target: context.target
        }).then(() => {
          this.loadHistory(context.contact_id)
      })
    },

    onJsSIPSessionFailed (context: ContextUAStateInterface, payload: any) {
      const cause: string = payload.cause
      this.$toast.error(this.$t('error_session_cause', { cause }), {
        position: POSITION.TOP_RIGHT,
        timeout: 2500,
        closeOnClick: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: true,
        hideProgressBar: true,
        closeButton: 'button',
        icon: true,
        rtl: false
      })
    }
  }
})

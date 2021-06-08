<template>
  <!--
  ----------------------------------------------------
   direction:  incoming | outgoing
   originator: local | remote
   cause:      Terminated               - RTCSession обычно завершается локальным или удаленным партнером.
               Canceled                 - RTCSession отменен локальным или удаленным узлом.
               No Answer                - На входящий вызов не ответили в течение времени, указанного в параметре конфигурации no_answer_timeout.
               Expires                  - Входящий вызов содержит заголовок Expires, и локальный пользователь не ответил в течение времени, указанного в заголовке.
               No ACK                   - На входящее ПРИГЛАШЕНИЕ был получен ответ с кодом состояния 2XX, но ACK не был получен.
               Dialog Error             - Запрос в диалоговом окне получил ошибку SIP 408 или 481.
               User Denied Media Access - Локальный пользователь отказал в доступе к медиа при запросе аудио-видео устройств.
               Bad Media Description    - Полученный SDP неверен.
               RTP Timeout              - Сессия завершена из-за потери RTP.
  ---------------------------------------------------
  //-->

  <div bottom content-class='custom-tooltip'>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          v-on="on"
          :color="callStackIcons.directionColor"
        >
          {{ callStackIcons.directionIcon }}
        </v-icon>
      </template>
      <span>{{ callStackIcons.directionText }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          v-on="on"
          :color="callStackIcons.originatorColor"
        >
          {{ callStackIcons.originatorIcon }}
        </v-icon>
      </template>
      <span>{{ callStackIcons.originatorText }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          v-on="on"
          :color="callStackIcons.caseColor"
        >
          {{ callStackIcons.caseIcon }}
        </v-icon>
      </template>
      <span>{{ callStackIcons.caseText }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

enum Originator {
  REMOTE = 'remote',
  LOCAL = 'local'
}

enum Direction {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing'
}

enum SIPErrorCauses {
  BUSY = 'Busy',
  REJECTED = 'Rejected',
  REDIRECTED = 'Redirected',
  UNAVAILABLE = 'Unavailable',
  NOT_FOUND = 'Not Found',
  ADDRESS_INCOMPLETE = 'Address Incomplete',
  INCOMPATIBLE_SDP = 'Incompatible SDP',
  AUTHENTICATION_ERROR = 'Authentication Error',
}

enum RTCSessionCause {
  BYE = 'Terminated',
  CANCELED = 'Canceled',
  BUSY = 'Busy',
  NO_ANSWER = 'No Answer',
  EXPIRES = 'Expires',
  NO_ACK = 'No ACK',
  DIALOG_ERROR = 'Dialog Error',
  USER_DENIED_MEDIA_ACCESS = 'User Denied Media Access',
  BAD_MEDIA_DESCRIPTION = 'Bad Media Description',
  RTP_TIMEOUT = 'RTP Timeout',
  SIP_FAILURE_CODE = 'SIP Failure Code'
}

interface ICallStackIcons {
  directionIcon: string,
  directionColor: string,
  directionText: string,
  originatorIcon: string,
  originatorColor: string,
  originatorText: string,
  caseIcon: string,
  caseColor: string,
  caseText: string,
}

export default Vue.extend({
  computed: {
    callStackIcons () {
      const callStackIcons: ICallStackIcons = {
        directionIcon: 'mdi-phone-' + this.direction,
        directionColor: 'green',
        directionText: this.$i18n.tc(this.direction),

        originatorIcon: this.originator === 'local' ? 'mdi-face-agent' : 'mdi-account',
        originatorColor: 'green',
        originatorText: this.$i18n.tc(this.originator === 'local' ? 'Operator' : 'Client'),

        caseIcon: '',
        caseColor: 'red',
        caseText: this.$i18n.tc(this.cause)
      }

      switch (this.cause) {
        case RTCSessionCause.BYE:
          callStackIcons.caseIcon = 'mdi-phone-hangup-outline'
          if (this.originator === 'local') {
            callStackIcons.caseColor = 'grey'
          }
          break
        case RTCSessionCause.CANCELED:
          callStackIcons.caseIcon = 'mdi-phone-cancel'
          if (this.originator === 'local') {
            callStackIcons.caseColor = 'grey'
          }
          break
        case RTCSessionCause.BUSY:
          callStackIcons.caseIcon = 'mdi-phone-missed'
          callStackIcons.caseColor = 'grey'
          break
        case RTCSessionCause.SIP_FAILURE_CODE:
          callStackIcons.caseIcon = 'mdi-phone-voip'
          callStackIcons.directionColor = 'red'
          callStackIcons.originatorColor = 'red'
          callStackIcons.caseColor = 'red'
          break
        default:
          callStackIcons.caseIcon = 'mdi-phone-remove'
          if (this.originator === 'local') {
            callStackIcons.caseColor = 'grey'
          }
          break
      }

      return callStackIcons
    }
  },

  name: 'AppCallDirection',

  props: {
    cause: {
      required: true,
      type: String
    },
    direction: {
      required: true,
      type: String
    },
    originator: {
      required: true,
      type: String
    }
  }
})
</script>

<style lang="scss" scoped>
 .v-toast-container {
   padding: 0 !important;
 }

 .v-toast-title {
   font-size: 18px;
   font-weight: 100;
 }
</style>

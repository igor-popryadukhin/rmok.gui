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

  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        v-bind="attrs"
        v-on="on"
        :color="callDirection.color"
      >
        {{ callDirection.icon }}
      </v-icon>
    </template>
    <span>{{ $tc(callDirection.text) }}</span>
  </v-tooltip>
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
  NO_ANSWER = 'No Answer',
  EXPIRES = 'Expires',
  NO_ACK = 'No ACK',
  DIALOG_ERROR = 'Dialog Error',
  USER_DENIED_MEDIA_ACCESS = 'User Denied Media Access',
  BAD_MEDIA_DESCRIPTION = 'Bad Media Description',
  RTP_TIMEOUT = 'RTP Timeout',
}

interface IStack {
  direction?: string;
  originator?: string;
  cause?: string;
  color: string;
  icon: string;
  text: string;
}

export default Vue.extend({
  computed: {
    callDirection () {
      const obj: IStack | undefined = this.$data.stack.find((e: IStack) => {
        return e.originator === this.originator && e.cause === this.cause && e.direction === this.direction
      })

      return obj || {
        color: 'red',
        icon: 'mdi-bug',
        text: 'Неизвестно: ' + `${this.direction} / ${this.originator} / ${this.cause}`
      }
    }
  },

  data () {
    return {
      stack: [
        {
          cause: RTCSessionCause.CANCELED,
          color: '#3a3a3a',
          direction: Direction.OUTGOING,
          icon: 'mdi-phone-outgoing',
          originator: Originator.REMOTE,
          text: 'Исходящий, отменён'
        },
        {
          cause: RTCSessionCause.BYE,
          color: '#3a3a3a',
          direction: Direction.INCOMING,
          icon: 'mdi-phone-incoming',
          originator: Originator.REMOTE,
          text: 'Входящий, клиент сам завершил разговор'
        },
        {
          cause: RTCSessionCause.CANCELED,
          color: '',
          direction: Direction.INCOMING,
          icon: 'mdi-phone-incoming',
          originator: Originator.REMOTE,
          text: 'Без ответа'
        }
      ] as IStack[]
    }
  },

  name: 'VCallDirection',

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

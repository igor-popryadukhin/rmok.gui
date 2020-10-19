<template>
  <div class="incoming-rtc-session">
    <div class="warp">
      <div class="button_answer">
        <v-btn
          icon
          outlined
          dark
          large
          @click.stop="$emit('answerClick')"
        >
          <v-icon>mdi-phone</v-icon>
        </v-btn>
      </div>
      <div class="d-inline-block display" style="text-align: center;">
        <div style="font-size: 20px; margin-bottom: 5px">
          {{ displayName }}
        </div>
        <div style="font-size: 16px; margin-bottom: 5px">
          + 7 (925)-604-10-55
        </div>
        <div style="font-size: 14px; margin-bottom: 5px">
          {{ seconds }}
        </div>
      </div>
      <div class="button_cancel">
        <v-btn
          icon
          outlined
          dark
          large
          @click.stop="$emit('cancelClick')"
        >
          <v-icon>mdi-phone-hangup</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { secondsToHms } from '@/utils/datetime'

export default Vue.extend({
  props: {
    displayName: {
      type: String,
      default: ''
    }
  },

  computed: {
    seconds () {
      return secondsToHms(this.$jsSIP.seconds)
    }
  }
})
</script>

<style lang="scss">

.display {
  padding: 0px 20px 0 20px;
}

.incoming-rtc-session {
  .warp {
    width: auto;
    display: flex;
    justify-content: space-between;
    padding: 1em;
    box-sizing: border-box;

    .button_cancel {
      align-self: center;
    }
    .button_cancel button {
      background-color: #ff0000 !important;
      box-shadow: 1px 1px 20px 1px #fb0006 !important;
    }

    .button_answer {
      align-self: center;
    }

    .button_answer button {
      background-color: green !important;
      box-shadow: 1px 1px 20px 1px #40a939 !important;
    }
  }
}
</style>

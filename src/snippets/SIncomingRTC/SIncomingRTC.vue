<template>
  <div class="text-center">
    <v-bottom-sheet
      v-model="sheetDisplay"
      transition="v-fade-transition"
      max-width="600px"
      hide-overlay
      persistent
      internal-activator
      no-click-animation
    >
      <v-sheet
        class="text-center"
        height="200px"
      >
        <v-btn
          class="mt-6"
          text
          color="error"
          @click="sheetDisplay = !sheetDisplay"
        >
          close
        </v-btn>
        <div class="my-3">
          This is a bottom sheet using the inset prop
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      sheetDisplay: false
    }
  },

  model: {
    event: 'change',
    prop: 'value'
  },

  name: 'SIncomingRTC',

  props: {

    displayName: {
      default: '',
      type: String
    },

    phoneNumber: {
      default: '',
      type: String
    },

    value: {
      default: false,
      type: Boolean
    }
  },

  watch: {
    sheetDisplay (val: boolean) {
      this.$emit('change', val)
    },

    value (val: boolean) {
      this.sheetDisplay = val
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
    min-width: 400px;
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

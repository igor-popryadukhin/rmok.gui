<template>
  <div>
    <v-btn
      @click="$jsSIP.call('+79256041055')"
    >
      CALL
    </v-btn>

    {{ session.seconds }} <br>
    {{ session.state }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { JsSIPSession } from '@/jsSIP/JsSIPSession'

export default Vue.extend({
  data () {
    return {
      session: {} as JsSIPSession
    }
  },
  created () {
    this.$jsSIP.on('sessionCreated', (session: JsSIPSession) => {
      this.session = session
      console.log('sessionCreated', session)
    })
  },

  beforeDestroy () {
    this.$jsSIP.off('sessionCreated')
  }
})
</script>

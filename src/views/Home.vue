<template>
  <v-layout>
    <v-btn-toggle>
      <v-btn
        v-if="!$dialer.isConnected()"
        @click="$dialer.connect()"
      >
        Connect
      </v-btn>
      <v-btn
        v-else
        color="red"
        @click="$dialer.disconnect()"
      >
        Disconnect
      </v-btn>
      <v-btn
        v-if="$dialer.state === 'idle'"
        :disabled="!$dialer.isConnected()"
        @click="call"
      >
        Call
      </v-btn>
      <v-btn
        v-else
        color="red"
        @click="$dialer.hangUp()"
      >
        Hang up
      </v-btn>
      <v-btn
        :disabled="$dialer.state !== 'progress'"
        @click="$dialer.answer()"
      >
        Answer
      </v-btn>
      <v-btn
        @click="onChangeConfig"
      >
        Change config
      </v-btn>
    </v-btn-toggle>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  methods: {
    call () {
      this.$dialer.call('+79256041055')
    },

    onChangeConfig () {
      this.$appDebug(this.$dialer.getUAParameter('authorization_user'))
      this.$appDebug(this.$dialer.getUAParameter('password'))
      this.$appDebug(this.$dialer.getUAParameter('uri'))
      this.$appDebug(this.$dialer.getUAParameter('realm'))
      this.$appDebug(this.$dialer.getUAParameter('contact_uri'))
      this.$appDebug(this.$dialer.getUAParameter('sockets'))
    }
  }
})
</script>

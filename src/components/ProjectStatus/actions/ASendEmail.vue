<template>
  <v-card
    outlined
    tile
    flat
  >
    <v-card-title>Это компонент теста</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="email"
        :label="$tc('E-mail address')"
        style="max-width: 450px"
      >
      </v-text-field>
    </v-card-text>
    <v-card-text>
      <v-textarea
        :label="$tc('Message')"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ASendEmail',

  props: {
    data: {
      type: Object,
      default: () => null
    }
  },

  data () {
    return {
      email: null
    }
  },

  watch: {},

  methods: {}
})
</script>

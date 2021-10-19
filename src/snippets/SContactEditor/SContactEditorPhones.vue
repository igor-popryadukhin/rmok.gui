<template>
  <v-list two-line>
    <v-list-item>
      <v-list-item-icon>
        <v-icon color="indigo">
          mdi-phone
        </v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>(650) 555-1234</v-list-item-title>
        <v-list-item-subtitle>Mobile</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-icon>
        <v-icon>mdi-message-text</v-icon>
      </v-list-item-icon>
    </v-list-item>

    <v-list-item>
      <v-list-item-action />

      <v-list-item-content>
        <v-list-item-title>(323) 555-6789</v-list-item-title>
        <v-list-item-subtitle>Work</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-icon>
        <v-icon>mdi-message-text</v-icon>
      </v-list-item-icon>
    </v-list-item>

    <v-divider inset />

    <v-list-item>
      <v-list-item-icon>
        <v-icon color="indigo">
          mdi-email
        </v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>aliconnors@example.com</v-list-item-title>
        <v-list-item-subtitle>Personal</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-action />

      <v-list-item-content>
        <v-list-item-title>ali_connors@example.com</v-list-item-title>
        <v-list-item-subtitle>Work</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider inset />

    <v-list-item>
      <v-list-item-icon>
        <v-icon color="indigo">
          mdi-map-marker
        </v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>1400 Main Street</v-list-item-title>
        <v-list-item-subtitle>Orlando, FL 79938</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { PhoneInterface } from './interfaces'
import Vue from 'vue'

export default Vue.extend({

  name: 'SContactEditorPhones',

  data () {
    return {
      phones: [] as PhoneInterface[]
    }
  },
  created () {
    this.phones.push({
      label: 'Персональный',
      value: '+79256041055'
    })
  },

  methods: {
    onAddClick () {
      this.phones.push({
        label: '',
        value: ''
      })
    }
  }
})
</script>

<style scoped>

</style>

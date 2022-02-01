<template>
  <div style="max-width: 450px">
    <v-list dense>
      <template v-for="(item, itemIndex) in integrations">
        <v-list-item
          :key="`v-list-item-` + itemIndex"
          :to="item.to"
          link
        >
          <v-list-item-avatar>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon color="green">
              mdi-check-circle-outline
            </v-icon>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="`v-divider-` + itemIndex" />
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Integrations extends Vue {
  get integrations () {
    return [
      {
        icon: 'mdi-whatsapp',
        title: 'WhatsApp',
        to: { name: 'integrations_whats_app' }
      },
      {
        icon: 'mdi-instagram',
        title: 'Instagram',
        to: { name: 'integrations_instagram' }
      },
      {
        icon: 'mdi-message',
        title: 'Telegram',
        to: { name: 'integrations_telegram' }
      }
    ]
  }
}
</script>

<style scoped>

</style>

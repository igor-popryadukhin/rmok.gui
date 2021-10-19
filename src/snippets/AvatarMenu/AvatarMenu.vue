<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        large
        v-bind="attrs"
        v-on="on"
      >
        <v-avatar
          color="#ff9800e3"
          style="color: white; font-size: 20px"
          item
        >
          {{ avatar }}
        </v-avatar>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :to="item.to"
        @click="item.click || function () { console.log('item click') }"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t(item.name) }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

  props: {},

  data () {
    return {
      items: [
        {
          icon: 'mdi-user',
          name: 'profile',
          to: {
            name: 'profile'
          }
        },
        {
          icon: 'mdi-settings',
          name: 'settings',
          to: {
            name: 'settings'
          }
        },
        {
          click: () => {
            // todo: delete cookie
          },
          icon: 'mdi-exit',
          name: 'exit'
        }
      ]
    }
  },
  computed: {
    avatar () {
      const first: string = this.$store.getters['profile/first_name'] || ''
      const last: string = this.$store.getters['profile/last_name'] || ''
      return first.charAt(0) + last.charAt(0)
    }
  }
})
</script>

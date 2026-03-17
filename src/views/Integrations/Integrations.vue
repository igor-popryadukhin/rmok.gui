<template>
  <div>
    <v-list>
      <template v-for="(item, itemIndex) in integrations">
        <v-divider
          v-if="itemIndex > 0"
          :key="'v-divider-' + itemIndex"
        />

        <v-list-item
          :key="'v-list-item-' + itemIndex"
          :to="item.to"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle v-if="item.subtitle">
              {{ item.subtitle }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Integrations extends Vue {
  get integrations () {
    return [
      {
        title: 'WhatsApp',
        subtitle: 'WhatsApp application',
        to: {
          name: 'integrations_whatsapp'
        }
      },
      {
        title: 'Telegram',
        subtitle: 'Telegram application',
        to: {
          name: 'integrations_whatsapp'
        }
      }
    ];
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <v-card
      flat
    >
      <template
        v-for="item in contacts"
      >
        <v-divider
          :key="item.id"
        />
        <v-list-item
          :key="item.id"
          ripple
          selectable
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.first_name }} {{ item.last_name }}</v-list-item-title>
            <v-list-item-subtitle v-if="item.phone_number_default">{{item.phone_number_default.type}}: {{ item.phone_number_default.value }}</v-list-item-subtitle>
            <v-list-item-subtitle v-else>Нет номера по умолчанию</v-list-item-subtitle>
          </v-list-item-content>
          <v-spacer />
          <v-list-item-content>
            <v-list-item-title
              v-if="item.user"
              class="text-right"
            >{{ item.user.first_name }} {{ item.user.last_name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ContactResponseInterface, Contacts } from '@/api/Contacts'
import { ContactInterface } from '@/api/Schemas/ContactInterface'

export default Vue.extend({
  data () {
    return {
      contacts: [] as ContactInterface[]
    }
  },
  beforeCreate () {
    new Contacts()
      .search()
      .then((contacts: ContactResponseInterface) => {
        // eslint-disable-next-line
        (this as any).contacts = contacts.items
      })
  }
})
</script>

<template>
  <v-card
    flat
  >
    <v-row>
      <v-col
        cols="12"
      >
        <v-toolbar flat>
          <v-toolbar-title>{{ contact.last_name }} {{ contact.first_name }} {{ contact.middle_name }}</v-toolbar-title>
          <v-spacer />
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :to="{ name: 'contacts_new' }"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('add_new_contact') }}</span>
          </v-tooltip>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col
        cols="12"
      >
        {{ contact }}
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'

interface ContactInterface {
  id: number;
  phone_numbers: PhoneInterface[];
  emails: EmailInterface[];
  first_name: string;
  last_name: string;
  middle_name: string;
  city: string;
  region: null;
  phone_number_default: null;
  owner: null;
}

interface EmailInterface {
  value: string;
  type: string;
}

interface PhoneInterface {
  value: string;
  type: string;
}

export default Vue.extend({
  data () {
    return {
      /* eslint-disable */
      contact: {
        city: '',
        emails: [],
        first_name: '',
        id: 0,
        last_name: '',
        middle_name: '',
        owner: null,
        phone_number_default: null,
        phone_numbers: [],
        region: null
      } as ContactInterface
      /* eslint-enable */
    }
  },

  beforeRouteUpdate (from, to, next) {
    new Contacts()
      .getById(+this.$route.params.id)
      .then((contact) => {
        (this as any).contact = contact
      })
    next()
  },

  created () {
    new Contacts()
      .getById(+this.$route.params.id)
      .then((contact) => {
        (this as any).contact = contact
      })
  }
})
</script>

<style scoped>

</style>

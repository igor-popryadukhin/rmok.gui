<template>
  <v-card
    flat
  >
    <v-row class="ma-0">
      <v-col
        cols="12"
        class="pa-0"
      >
        <v-toolbar
          flat
          class="pa-0 tool-bar"
        >
          <v-toolbar-title>{{ contact.last_name }} {{ contact.first_name }} {{ contact.middle_name }}</v-toolbar-title>
          <v-spacer />
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-on="on"
                v-bind="attrs"
                color="green"
              >
                <v-icon>mdi-phone</v-icon>
              </v-btn>
            </template>
            <span>{{ callTo }}</span>
          </v-tooltip>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-divider />
    <v-row class="ma-0">
      <v-col
        cols="12"
        class="pa-0"
      >
        {{ contact }}
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'
import lvovich from '@/mixins/lvovich'

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
  mixins: [lvovich],
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

  computed: {
    callTo () {
      /* eslint-disable */
      const r = (this as any).$incline({
          first: (this as any).contact.first_name,
          last: (this as any).contact.last_name
        },
        'dative')
      return this.$t('call_to', { first: r.first, last: r.last })
      /* eslint-enable */
    }
  },

  beforeRouteUpdate (from, to, next) {
    /* eslint-disable */
    new Contacts()
      .getById(+this.$route.params.id)
      .then((contact) => {
        (this as any).contact = contact
      }).catch(() => {
        this.$router.replace({ path: '/contacts' })
      })
    /* eslint-enable */
    next()
  },

  created () {
    new Contacts()
      .getById(+this.$route.params.id)
      .then((contact) => {
        (this as any).contact = contact
      }).catch(() => {
        this.$router.replace({ path: '/contacts' })
      })
  }
})
</script>

<style lang="scss">
 .tool-bar div {
   padding-left: 0;
 }
</style>

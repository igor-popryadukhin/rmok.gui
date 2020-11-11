<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <div class="text-h6">Профиль</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="profile.first_name"
            :label="$tc('first_name')"
            persistent-hint
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="profile.last_name"
            :label="$tc('last_name')"
            persistent-hint
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="profile.middle_name"
            :label="$tc('middle_name')"
            persistent-hint
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
        >
          <v-btn
            text
            tile
          >{{ $tc('Save') }}</v-btn>
        </v-col>
      </v-row>
      <!-- CONTACTS -->
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <div class="text-h6">Контакты</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="profile.phone"
            :label="$tc('contact_number')"
            persistent-hint
            required
          >
            <template v-slot:append>
              <v-tooltip bottom max-width="400">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-on="on" v-bind="attrs">mdi-help-circle-outline</v-icon>
                </template>
                <span>{{ $tc('contact_number_tool_tip') }}</span>
              </v-tooltip>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="profile.email"
            :label="$tc('contact_email')"
            persistent-hint
          ><template v-slot:append>
            <v-tooltip bottom max-width="400">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-on="on" v-bind="attrs">mdi-help-circle-outline</v-icon>
              </template>
              <span>{{ $tc('contact_email_tool_tip') }}</span>
            </v-tooltip>
          </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProfileInterface } from '@/api/Account'

export default Vue.extend({
  data () {
    return {
      profile: {
        created_at: 0,
        email: '',
        phone: '',
        first_name: '',
        id: 0,
        last_name: '',
        login: '',
        middle_name: '',
        role: undefined,
        userpic: null
      } as ProfileInterface
    }
  },

  created () {
    this.profile.id = this.$store.getters['profile/id']
    this.profile.login = this.$store.getters['profile/login']
    this.profile.email = this.$store.getters['profile/email']
    this.profile.phone = this.$store.getters['profile/phone']
    this.profile.first_name = this.$store.getters['profile/first_name']
    this.profile.last_name = this.$store.getters['profile/last_name']
    this.profile.middle_name = this.$store.getters['profile/middle_name']
  }
})
</script>

<style scoped>

</style>

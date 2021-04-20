<template>
  <v-form
    class="pa-2 overflow-y-auto overflow-x-hidden"
    :style="{height: `${$screenHeight - 130}px`}"
  >
      <!-- Name -->
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
        <div class="text-h6 grey--text">{{ $tc('Profile') }}</div>
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

      <!-- Contacts -->
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
        <div class="text-h6 grey--text">{{ $tc('Contacts')  }}</div>
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

    <!-- Organization -->
    <v-row>
      <v-col
        cols="12"
        lg="6"
        md="12"
      >
        <div class="text-h6 grey--text">{{ $tc('Organization') }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        lg="6"
        md="12"
      >
        <v-text-field
          :value="profile.organization ? profile.organization.name : '—'"
          :label="$tc('Name')"
          readonly
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
          :value="profile.organization ? profile.organization.city : '—'"
          :label="$tc('City')"
          readonly
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
          :value="profile.organization ? profile.organization.address : '—'"
          :label="$tc('Address')"
          readonly
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
            :loading="profileSaveLoading"
            @click="onSave"
          >{{ $tc('Save') }}</v-btn>
        </v-col>
      </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Account, ProfileInterface } from '@/api/Account'

export default Vue.extend({
  created () {
    this.profile.id = this.$store.getters['profile/id']
    this.profile.login = this.$store.getters['profile/login']
    this.profile.email = this.$store.getters['profile/email']
    this.profile.phone = this.$store.getters['profile/phone']
    this.profile.first_name = this.$store.getters['profile/first_name']
    this.profile.last_name = this.$store.getters['profile/last_name']
    this.profile.middle_name = this.$store.getters['profile/middle_name']
    this.profile.organization = this.$store.getters['profile/organization']
  },

  data () {
    return {
      profile: {
        created_at: 0,
        email: '',
        first_name: '',
        id: 0,
        last_name: '',
        login: '',
        middle_name: '',
        organization: null,
        phone: '',
        role: undefined,
        userpic: null
      } as ProfileInterface,
      profileSaveLoading: false
    }
  },

  methods: {
    onSave () {
      this.profileSaveLoading = true
      new Account()
        .updateProfile({
          email: this.profile.email,
          first_name: this.profile.first_name,
          last_name: this.profile.last_name,
          middle_name: this.profile.middle_name,
          phone: this.profile.phone
        }).then(() => {
          this.$toast.success(this.$tc('Changes saved'))
          this.$store.dispatch('profile/loadProfile')
        }).catch((e) => {
          this.$toast.error(e.statusText || e.error_message || e || 'undefined')
        }).finally(() => {
          this.profileSaveLoading = false
        })
    }
  }
})
</script>

<style scoped>

</style>

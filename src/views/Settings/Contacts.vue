<template>
  <v-sheet
    tile
    flat
  >
    <app-tools>
      <template v-slot:left>
        <h2 class="grey--text">{{ $tc('Contacts') }}</h2>
      </template>
      <template v-slot:right>
        <v-btn
          :color="$vuetify.theme.currentTheme.primary"
          :disabled="!isModified"
          :loading="saveProcess"
          outlined
          text
          tile
          small
          @click="onSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </template>
    </app-tools>

    <v-row>
      <v-col
        v-bind="colsDisplay"
      >
        <v-select
          v-model="countryId"
          :items="countries"
          :label="$tc('Country')"
          item-text="name"
          item-value="id"
          flat
          dense
          outlined
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.full_name }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>

          <template v-slot:append-item>
            <v-divider />
            <div class="px-4 pt-2">
              <v-btn
                href="mailto:incoming+iprus74-rmok-ui-21309259-issue-@incoming.gitlab.com"
                tile
                dense
                block
                small
                text
              >
                {{ $tc('My country is not on the list') }}
              </v-btn>
            </div>
          </template>
        </v-select>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import Account from '@/api/Account'
import { Database } from '@/api/Database'
import AppTools from '@/components/AppTools/AppTools.vue'
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  components: { AppTools },

  data () {
    return {
      // Идентификатор страны
      countryId: 0,
      saveProcess: false,
      countries: []
    }
  },

  computed: {
    ...mapGetters({
      profile_country: 'profile/country'
    }),

    colsDisplay () {
      return {
        cols: 12,
        xl: 4,
        lg: 4,
        md: 4,
        sm: 12,
        xs: 12
      }
    },

    isModified () {
      if (this.profile_country?.id !== this.countryId) {
        return true
      }

      return false
    }
  },

  created () {
    this.countryId = this.profile_country?.id || 0

    new Database()
      .getCountries()
      .then((response) => {
        this.countries = response
      })
  },

  methods: {

    onSaveClick () {
      this.saveProcess = true
      new Account()
        .updateProfile({
          country_id: this.countryId
        }).then(() => {
          this.$toast.success(this.$tc('Changes accepted'))
          this.$store.dispatch('profile/loadProfile')
        }).finally(() => (this.saveProcess = false))
    }
  }
})
</script>

<style scoped>

</style>

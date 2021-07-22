<template>
  <v-sheet
    tile
    flat
  >
    <app-tools>
      <template #left>
        <h2 class="grey--text">
          {{ $tc('Contacts') }}
        </h2>
      </template>
      <template #right>
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
    <v-divider class="mb-2" />

    <v-row>
      <v-col
        v-bind="colsDisplay"
      >
        <v-select
          v-model="countryId"
          :items="countries"
          :label="$tc('Country')"
          :error-messages="countryMessageError"
          item-text="name"
          item-value="id"
          flat
          @focus="countryMessageError = null"
        >
          <template #item="{ item }">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.full_name }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>

          <template #append-item>
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

interface Data {
  [keys: string]: any;
}

interface Methods {
  [keys: string]: any;
}

interface Computed {
  [keys: string]: any;
}

interface Props {
  [keys: string]: any;
}

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { AppTools },

  data () {
    return {
      // Идентификатор страны
      countryId: 0,
      saveProcess: false,
      countries: [],
      countryMessageError: null
    }
  },

  computed: {

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
      return this.$profile.country?.id !== this.countryId
    }
  },

  created () {
    this.countryId = this.$profile.country?.id || 0

    new Database()
      .getCountries()
      .then((response) => {
        this.$data.countries = response
      })
  },

  mounted () {
    if (!this.$profile.country?.id) {
      this.$data.countryMessageError = this.$tc('Choose your country')
    }
  },

  methods: {

    onSaveClick () {
      this.saveProcess = true
      new Account()
        .updateProfile({
          country_id: this.countryId
        }).then(() => {
          this.$toast.success(this.$tc('Changes accepted'))
          this.$store.dispatch('profile/load')
        }).finally(() => (this.saveProcess = false))
    }
  }
})
</script>

<style scoped>

</style>

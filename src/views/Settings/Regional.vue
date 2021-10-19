<template>
  <v-sheet
    class="ml-1"
    tile
    flat
  >
    <app-tools>
      <template #left>
        <h2 class="grey--text">
          {{ $tc('Time settings') }}
        </h2>
      </template>
      <template #right>
        <v-btn
          :loading="processSaving"
          color="primary"
          outlined
          small
          text
          tile
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
          v-model="tz_value"
          :items="tz_names"
          :messages="tz_messages"
          :disable-lookup="false"
        >
          <template #item="{ item }">
            {{ $dayjs().tz(item).format('UTC (Z)') }} {{ item }}
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-row class="mt-5">
      <v-col
        v-bind="colsDisplay"
      >
        <h3 class="grey--text mb-5">
          {{ $tc('Regional data format') }}
        </h3>

        <!-- Полная дата -->
        <v-text-field
          v-model="date_time_format_long_date"
          :label="$tc('Long date')"
        >
          <template #append>
            <div class="mt-1">
              {{ $dayjs().format(date_time_format_long_date) }}
            </div>
          </template>
        </v-text-field>
        <!-- Полная дата -->

        <!-- Краткая дата -->
        <v-text-field
          v-model="date_time_format_short_date"
          :label="$tc('Short date')"
        >
          <template #append>
            <div class="mt-1">
              {{ $dayjs().format(date_time_format_short_date) }}
            </div>
          </template>
        </v-text-field>
        <!-- Краткая дата -->

        <!-- Полное время -->
        <v-text-field
          v-model="date_time_format_long_time"
          :label="$tc('Long time')"
        >
          <template #append>
            <div class="mt-1">
              {{ $dayjs().format(date_time_format_long_time) }}
            </div>
          </template>
        </v-text-field>
        <!-- Полное время -->

        <!-- Краткое время -->
        <v-text-field
          v-model="date_time_format_short_time"
          :label="$tc('Short time')"
        >
          <template #append>
            <div class="mt-1">
              {{ $dayjs().format(date_time_format_short_time) }}
            </div>
          </template>
        </v-text-field>
        <!-- Краткое время -->
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import Account from '@/api/Account'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import timeZones from '@/time-zones.json'

export default Vue.extend({
  data () {
    return {
      processSaving: false
    }
  },

  computed: {
    ...mapGetters({
      profile: 'profile/profile',
      date_time_format: 'settings/date_time_format'
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

    date_time_format_long_time: {
      get () {
        return this.date_time_format.long_time
      },
      set (value: string) {
        return this.$store.commit('settings/date_time_format_long_time', value)
      }
    },

    date_time_format_short_time: {
      get () {
        return this.date_time_format.short_time
      },
      set (value: string) {
        return this.$store.commit('settings/date_time_format_short_time', value)
      }
    },

    date_time_format_long_date: {
      get () {
        return this.date_time_format.long_date
      },
      set (value: string) {
        return this.$store.commit('settings/date_time_format_long_date', value)
      }
    },

    date_time_format_short_date: {
      get () {
        return this.date_time_format.short_date
      },
      set (value: string) {
        return this.$store.commit('settings/date_time_format_short_date', value)
      }
    },

    tz_messages () {
      return [`Часовой пояс системы: ${(this.$dayjs as any).tz.guess()}`]
    },

    tz_names () {
      return timeZones
    },

    tz_value: {
      // tslint:disable-next-line
      get () { return this.$store.getters['profile/profile_tz'] || (this.$dayjs as any).tz.guess() },
      set (val: string) { this.$store.commit('profile/tz', val) }
    }
  },

  methods: {

    onSaveClick () {
      const data: Record<string, string> = {}
      data.tz = this.tz_value as string

      this.$data.processSaving = true
      new Account()
        .updateProfile(data)
        .then(() => {
          this.$toast.success(this.$tc('Changes accepted'))
          this.$store.dispatch('profile/load')
        }).finally(() => (this.$data.processSaving = false))
    }
  }
})
</script>

<style scoped>

</style>

<template>
  <v-card
    class="ml-1"
    tile
    flat
  >
    <h3 class="grey--text mb-5">{{ $tc('Time settings') }}</h3>
    <v-row>
      <v-col
        v-bind="colsDisplay"
      >
        <v-select
          v-model="tz_value"
          :items="tz_names"
          :messages="tz_messages"
          :disable-lookup="false"
          outlined
          dense
        >
          <template v-slot:item="{ item }">
            {{ $moment().tz(item).format('UTC(Z)') }} {{ item }}
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-row class="mt-5">
      <v-col
        v-bind="colsDisplay"
      >
        <h3 class="grey--text mb-5">{{ $tc('Regional data format') }}</h3>

        <!-- Полная дата -->
        <v-text-field
          v-model="date_time_format_long_date"
          :label="$tc('Long date')"
          dense
          outlined
        >
          <template v-slot:append>
            <div class="mt-1">
              {{ $moment().format(date_time_format_long_date) }}
            </div>
          </template>
        </v-text-field>
        <!-- Полная дата -->

        <!-- Краткая дата -->
        <v-text-field
          v-model="date_time_format_short_date"
          :label="$tc('Short date')"
          dense
          outlined
        >
          <template v-slot:append>
            <div class="mt-1">
              {{ $moment().format(date_time_format_short_date) }}
            </div>
          </template>
        </v-text-field>
        <!-- Краткая дата -->

        <!-- Полное время -->
        <v-text-field
          v-model="date_time_format_long_time"
          :label="$tc('Long time')"
          dense
          outlined
        >
          <template v-slot:append>
            <div class="mt-1">
              {{ $moment().format(date_time_format_long_time) }}
            </div>
          </template>
        </v-text-field>
        <!-- Полное время -->

        <!-- Краткое время -->
        <v-text-field
          v-model="date_time_format_short_time"
          :label="$tc('Short time')"
          dense
          outlined
        >
          <template v-slot:append>
            <div class="mt-1">
              {{ $moment().format(date_time_format_short_time) }}
            </div>
          </template>
        </v-text-field>
        <!-- Краткое время -->
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn
          color="success"
          outlined
          text
          tile
          @click="onSaveClick"
        >{{ $tc('Save settings') }}</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Account from '@/api/Account'
import Vue from 'vue'
import momentTZ from 'moment-timezone'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters({
      profile_tz: 'profile/tz',
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
      return [`Часовой пояс системы: ${momentTZ.tz.guess()}`]
    },

    tz_names () {
      return momentTZ.tz.names()
    },

    tz_value: {
      get () { return this.profile_tz || momentTZ.tz.guess() },
      set (val: string) { this.$data.tz = val }
    }
  },

  data () {
    return {
      tz: momentTZ.tz.guess() // Default
    }
  },

  methods: {

    onSaveClick () {
      const data: any = {}
      data.tz = this.$data.tz
      new Account()
        .updateProfile(data)
        .then(() => {
          this.$toast.success(this.$tc('Changes saved'))
          this.$store.dispatch('profile/loadProfile')
        })
    }
  }
})
</script>

<style scoped>

</style>

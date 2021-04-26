<template>
  <v-card
    class="ml-1"
    tile
    flat
  >
    <h3 class="grey--text mb-5">Настройки времени</h3>
    <v-row>
      <v-col
        cols="12"
        md="4"
        lg="3"
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
      profile_tz: 'profile/tz'
    }),

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

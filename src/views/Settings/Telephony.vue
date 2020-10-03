<template>
  <div>
    <v-form>
      <v-container>
        <v-row>
          <v-col
            cols="12"
          >
            <v-text-field
              v-model="firstname"
              :label="$tc('sip_phone_number')"
              :hint="$tc('sip_phone_number_hint')"
              persistent-hint
              required
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
          >
            <v-text-field
              v-model="lastname"
              :label="$tc('server_address')"
              :hint="$tc('server_address_hint')"
              persistent-hint
              required
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
          >
            <v-text-field
              v-model="lastname"
              :label="$tc('login')"
              :hint="$tc('login_hint')"
              persistent-hint
              required
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
          >
            <v-text-field
              v-model="lastname"
              :label="$tc('password')"
              :hint="$tc('password_hint')"
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
            >{{ $tc('save') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style scoped>

</style>

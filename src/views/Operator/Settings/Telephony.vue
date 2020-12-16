<template>
  <div>
    <v-form>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="12"
          >
            <v-text-field
              v-model="config.display_name"
              :label="$tc('sip_display_name')"
              :hint="$tc('sip_display_name_hint')"
              persistent-hint
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="10"
          >
            <v-text-field
              v-model="config.server"
              :label="$tc('server_address')"
              :hint="$tc('server_address_hint')"
              persistent-hint
              required
            ></v-text-field>
          </v-col>
          <v-col
            cols="2"
          >
            <v-text-field
              v-model="config.port"
              :label="$tc('server_port')"
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
              v-model="config.login"
              :label="$tc('Login')"
              :hint="$tc('login_hint')"
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
              v-model="config.password"
              :label="$tc('password')"
              :hint="$tc('password_hint')"
              :type="password.visible ? '' : 'password'"
              persistent-hint
              required
            >
              <template v-slot:append>
                <v-btn
                  v-if="password.visible"
                  icon
                  @click="password.visible = false"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  icon
                  @click="password.visible = true"
                >
                  <v-icon>mdi-eye-off</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
          >
            <v-btn
              text
              tile
              @click="onSave"
            >{{ $tc('Save') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ATEConfigurationInterface, Configurations } from '@/api/Configurations'

export default Vue.extend({
  data () {
    return {
      password: {
        visible: false
      },
      config: {
        /* eslint-disable */
        display_name: '',
        login: '',
        password: '',
        server: '',
        port: 0
        /* eslint-enable */
      } as ATEConfigurationInterface
    }
  },
  created () {
    new Configurations()
      .getATEConfigurations()
      .then((config: ATEConfigurationInterface) => {
        /* eslint-disable */
        this.config.display_name = config.display_name || ''
        this.config.server = config.server || ''
        this.config.password = config.password || ''
        this.config.login = config.login || ''
        this.config.port = config.port || 8089
        /* eslint-enable */
      })
  },

  methods: {
    onSave () {
      new Configurations()
        .setATEConfigurations(this.config)
        .then(() => {
          this.$root.$emit('root-jssip-initialize')
          this.$toast.success(this.$tc('configuration_saved_successfully'))
        })
    }
  }
})
</script>

<style scoped>

</style>

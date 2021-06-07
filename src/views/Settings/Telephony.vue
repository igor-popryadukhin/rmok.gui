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
              :rules="[assertLength({ max: 20 })]"
              counter
              autofocus
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
              :rules="[rules.notBlank, rules.ipOrDomain]"
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
              :rules="[rules.positive]"
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
              :rules="[rules.notBlank, rules.noSpace]"
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
              :rules="[rules.notBlank, rules.noSpace]"
              autocomplete="new-password"
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
              :loading="processSave"
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
import rules from '@/mixins/rules'
import { Configurations } from '@/api/Configurations'
import PBXInterface from '@/api/Schemas/PBXInterface'

export default Vue.extend({
  beforeRouteEnter (to, from, next) {
    new Configurations()
      .getATEConfigurations()
      .then((config: PBXInterface) => {
        next(vm => {
          vm.config.display_name = config.display_name || ''
          vm.config.server = config.server || ''
          vm.config.password = config.password || ''
          vm.config.login = config.login || ''
          vm.config.port = config.port || 8089
        })
      })
  },

  data () {
    return {
      config: {
        /* eslint-disable */
        display_name: '',
        login: '',
        password: '',
        server: '',
        port: 0
        /* eslint-enable */
      } as PBXInterface,
      password: {
        visible: false
      },
      processSave: false
    }
  },

  methods: {
    onSave () {
      this.processSave = true
      new Configurations()
        .setATEConfigurations(this.config)
        .then(() => {
          this.$root.$emit('root-jssip-initialize')
          this.$toast.success(this.$tc('configuration_saved_successfully'))
        })
        .finally(() => (this.processSave = false))
    }
  },
  mixins: [rules]
})
</script>

<style scoped>

</style>

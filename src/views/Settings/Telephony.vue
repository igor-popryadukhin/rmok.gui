<template>
  <v-sheet>
    <app-tools>
      <template v-slot:left>
        <h2 class="grey--text">{{ $tc('Telephony') }}</h2>
      </template>
    </app-tools>

    <app-tools>
      <template v-slot:left>
        <h3 class="grey--text">
          {{ $tc('Connection parameters' )}}
        </h3>
      </template>
      <template v-slot:right>
        <v-btn
          :color="$vuetify.theme.currentTheme.primary"
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
    <v-divider />

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
          type="number"
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
    <v-row class="mb-5">
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
      <!-- ICE servers -->
      <v-col>
        <app-tools>
          <template v-slot:left>
            <h3 class="grey--text">
              {{ $tc('ice_server', 2) }}
            </h3>
          </template>
          <template v-slot:right>
            <v-btn
              :color="$vuetify.theme.currentTheme.primary"
              outlined
              text
              tile
              small
              @click="onBtnAddStunTurnServerClick"
            >
              {{ $tc('Add') }}
            </v-btn>
          </template>
        </app-tools>
        <v-divider />

        <template v-if="settingsPcConfigIceServers.length > 0">
          <v-list
            max-width="800"
            class="mb-5"
            dense
          >
            <template v-for="(item, index) in settingsPcConfigIceServers">
              <v-list-item
                :key="'v-list-item-' + index"
                link
              >
                <v-list-item-content class="py-0">
                  <v-list-item-title>
                    {{ Array.isArray(item.urls) ? item.urls.join(', ') : item.urls }}
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-action class="mx-0 ml-1">
                  <v-btn
                    block
                    icon
                    small
                    @click="onBtnEditStunTurnServerClick(item, index)"
                  >
                    <v-icon small>mdi-square-edit-outline</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action class="mx-0 ml-1">
                  <v-btn
                    block
                    icon
                    small
                    @click="onBtnDeleteStunTurnServerClick(item.urls, index)"
                  >
                    <v-icon small>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <v-divider v-show="settingsPcConfigIceServers.length > 1" :key="'v-divider-' + index"/>
            </template>
          </v-list>
        </template>
        <template v-else>
          <div class="d-flex justify-center">
            <div class="pa-16 grey--text">
              {{ $tc('Empty') }}
            </div>
          </div>
        </template>
      </v-col>
      <!-- ICE servers -->

      <v-divider vertical />

      <!-- ICE options -->
      <v-col>
        <app-tools>
          <template v-slot:left>
            <h3 class="grey--text">
              {{ $tc('ICE options') }}
            </h3>
          </template>
        </app-tools>
        <v-divider />
        <div class="d-flex flex-column">
          <div>
            <v-radio-group
              v-model="settingsPcConfigIceTransportPolicy"
              label="IceTransports value"
              row
            >
              <v-radio
                label="All"
                value="all"
              ></v-radio>
              <v-radio
                label="Relay"
                value="relay"
              ></v-radio>
            </v-radio-group>
          </div>
          <div>
            <v-slider
              v-model="settingsPcConfigIceCandidatePoolSize"
              label="ICE Candidate Pool"
              max="10"
              ticks
              persistent-hint
            ></v-slider>
          </div>
          <div>
            <v-checkbox
              v-model="settingsPcConfigRtcpMuxPolicy"
              label="Мультиплексирование"
            ></v-checkbox>
          </div>
        </div>
      </v-col>
      <!-- ICE options -->
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import AppICEServerEditor from '@/components/AppICEServerEditor/AppICEServerEditor.vue'
import Vue from 'vue'
import rules from '@/mixins/rules'
import { Configurations } from '@/api/Configurations'
import PBXInterface from '@/api/Schemas/PBXInterface'
import { mapGetters } from 'vuex'

export default Vue.extend({

  mixins: [rules],

  beforeRouteEnter (to, from, next) {
    new Configurations()
      .getATEConfigurations()
      .then((config: PBXInterface) => {
        next(vm => {
          vm.$data.config.display_name = config.display_name || ''
          vm.$data.config.server = config.server || ''
          vm.$data.config.password = config.password || ''
          vm.$data.config.login = config.login || ''
          vm.$data.config.port = config.port || 8089
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

  computed: {
    ...mapGetters({
      settingsPcConfigIceServers: 'settings/pc_config_ice_servers'
    }),

    settingsPcConfigIceTransportPolicy: {
      get () {
        return this.$store.getters['settings/pc_config_ice_transport_policy']
      },
      set (value: 'all' | 'relay') {
        return this.$store.commit('settings/pc_config_ice_transport_policy', value)
      }
    },

    settingsPcConfigIceCandidatePoolSize: {
      get () {
        return this.$store.getters['settings/pc_config_ice_candidate_pool_size']
      },
      set (value: number) {
        return this.$store.commit('settings/pc_config_ice_candidate_pool_size', value)
      }
    },

    /** Мультиплексирование */
    settingsPcConfigRtcpMuxPolicy: {
      get () {
        return this.$store.getters['settings/pc_config_rtcp_mux_policy']
      },
      set (value: boolean) {
        return this.$store.commit('settings/pc_config_rtcp_mux_policy', value ? 'require' : undefined)
      }
    }

  },

  methods: {

    onBtnDeleteStunTurnServerClick (urls: string | string[], index: number) {
      this.$dialog.confirm({
        title: this.$tc('Confirmation request'),
        text: this.$t('Delete "{value}"?', { value: Array.isArray(urls) ? urls.join(', ') : urls }).toString(),
        showClose: false,
        actions: {
          false: {
            small: true,
            text: this.$tc('Cancel')
          },
          true: {
            small: true,
            text: this.$tc('Yes')
          }
        }
      }).then((result: boolean) => {
        if (result) {
          // eslint-disable-next-line no-undef
          const servers: RTCIceServer[] = this.$store.getters['settings/pc_config_ice_servers']
          servers.splice(index, 1)
          this.$store.commit('settings/pc_config_ice_servers', servers)
        }
      })
    },

    // eslint-disable-next-line no-undef
    async onBtnEditStunTurnServerClick (item: RTCIceServer, index: number) {
      const dialog = await this.$dialog.show(AppICEServerEditor, {
        waitForResult: false,
        showClose: false,
        // Props
        urls: Array.isArray(item.urls) ? item.urls.join(', ') : item.urls,
        username: item.username,
        password: item.credential,
        // Handlers
        handler: (target: 'save' | 'cancel', value: unknown & {urls: string; username?: string; password?: string}) => {
          if (target === 'save') {
            // eslint-disable-next-line no-undef
            const servers: RTCIceServer[] = this.$store.getters['settings/pc_config_ice_servers']

            servers[index].username = value.username
            servers[index].credential = value.password
            servers[index].urls = value.urls
              .replace(/\s+/, '')
              .split(',')
              .map(e => e.trim())

            this.$store.commit('settings/pc_config_ice_servers', servers)
          }
          dialog.close()
        }
      })
    },

    async onBtnAddStunTurnServerClick () {
      const dialog = await this.$dialog.show(AppICEServerEditor, {
        waitForResult: false,
        handler: (target: 'save' | 'cancel', value: unknown & { urls: string; username?: string; password?: string }) => {
          if (target === 'save') {
            // eslint-disable-next-line no-undef
            const servers: RTCIceServer[] = this.$store.getters['settings/pc_config_ice_servers']

            servers.push({
              username: value.username,
              credential: value.password,
              credentialType: 'password',
              urls: value.urls
                .replace(/\s+/, '')
                .split(',')
                .map(e => e.trim())
            })

            this.$store.commit('settings/pc_config_ice_servers', servers)
          }
          dialog.close()
        }
      })
    },

    onSaveClick () {
      this.$data.processSave = true
      new Configurations()
        .setATEConfigurations(this.$data.config)
        .then(() => {
          this.$root.$emit('root-jssip-initialize')
          this.$toast.success(this.$tc('configuration_saved_successfully'))
        })
        .finally(() => (this.$data.processSave = false))
    }
  }
})
</script>

<style scoped>

</style>

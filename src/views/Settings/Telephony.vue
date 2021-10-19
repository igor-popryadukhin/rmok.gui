<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h2 class="grey--text">
          {{ $tc('Telephony') }}
        </h2>
      </template>
      <template #right>
        <v-btn
          :disabled="!profilePbxConfigValid"
          :loading="processSave"
          color="primary"
          outlined
          text
          tile
          small
          @click="onBtnSavePBXConfigClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </template>
    </app-tools>
    <v-divider />

    <!-- Номер SIP телефона -->
    <v-form
      v-model="profilePbxConfigValid"
      lazy-validation
    >
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="profilePbxConfigDisplayName"
            :label="$tc('SIP phone number')"
            :hint="$tc('The phone number that is displayed when calling from your PBX')"
            persistent-hint
            :rules="[assertLength({ max: 20 })]"
            counter
            autofocus
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="10"
        >
          <v-text-field
            v-model="profilePbxConfigServer"
            :label="$tc('Server address')"
            :hint="$tc('The address of your PBX server. For example: pbx.mycompany.ru:4445')"
            persistent-hint
            :rules="[rules.notBlank, rules.ipOrDomain]"
            required
          />
        </v-col>
        <v-col
          cols="2"
        >
          <v-text-field
            v-model="profilePbxConfigPort"
            :label="$tc('server_port')"
            type="number"
            persistent-hint
            :rules="[rules.positive]"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="profilePbxConfigLogin"
            :label="$tc('Login')"
            :hint="$tc('Login to access your PBX. For example: 003452')"
            persistent-hint
            :rules="[rules.notBlank, rules.noSpace]"
            required
          />
        </v-col>
      </v-row>
      <v-row class="mb-5">
        <v-col
          cols="12"
          lg="6"
          md="12"
        >
          <v-text-field
            v-model="profilePbxConfigPassword"
            :label="$tc('Password')"
            :hint="$tc('PBX access password')"
            :type="password.visible ? '' : 'password'"
            persistent-hint
            required
            :rules="[rules.notBlank, rules.noSpace]"
            autocomplete="new-password"
          >
            <template #append>
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
    </v-form>

    <v-row>
      <!-- ICE servers -->
      <v-col>
        <app-tools>
          <template #left>
            <h3 class="grey--text">
              {{ $tc('ice_server', 2) }}
            </h3>
          </template>
          <template #right>
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
                    <v-icon small>
                      mdi-square-edit-outline
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action class="mx-0 ml-1">
                  <v-btn
                    block
                    icon
                    small
                    @click="onBtnDeleteStunTurnServerClick(item.urls, index)"
                  >
                    <v-icon small>
                      mdi-trash-can-outline
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <v-divider
                v-show="settingsPcConfigIceServers.length > 1"
                :key="'v-divider-' + index"
              />
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
          <template #left>
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
              />
              <v-radio
                label="Relay"
                value="relay"
              />
            </v-radio-group>
          </div>
          <div>
            <v-slider
              v-model="settingsPcConfigIceCandidatePoolSize"
              label="ICE Candidate Pool"
              max="10"
              ticks
              persistent-hint
            />
          </div>
          <div>
            <v-checkbox
              v-model="settingsPcConfigRtcpMuxPolicy"
              label="Мультиплексирование"
            />
          </div>
        </div>
      </v-col>
      <!-- ICE options -->
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import PBXConfig from '@/api/interfaces/PBXConfig'
import AppICEServerEditor from '@/components/AppICEServerEditor/AppICEServerEditor.vue'
import Vue from 'vue'
import rules from '@/mixins/rules'
import { Configurations } from '@/api/Configurations'
import { mapGetters } from 'vuex'

export default Vue.extend({

  mixins: [rules],

  data () {
    return {
      profilePbxConfigValid: false,
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

    profilePbxConfigDisplayName: {
      get () {
        return this.$store.getters['profile/pbx_config/display_name']
      },
      set (value: string) {
        return this.$store.commit('profile/pbx_config/display_name', value)
      }
    },

    profilePbxConfigServer: {
      get () {
        return this.$store.getters['profile/pbx_config/server']
      },
      set (value: string) {
        return this.$store.commit('profile/pbx_config/server', value)
      }
    },

    profilePbxConfigPort: {
      get () {
        return this.$store.getters['profile/pbx_config/port']
      },
      set (value: number) {
        return this.$store.commit('profile/pbx_config/port', +value)
      }
    },

    profilePbxConfigLogin: {
      get () {
        return this.$store.getters['profile/pbx_config/login']
      },
      set (value: string) {
        return this.$store.commit('profile/pbx_config/login', value)
      }
    },

    profilePbxConfigPassword: {
      get () {
        return this.$store.getters['profile/pbx_config/password']
      },
      set (value: string) {
        return this.$store.commit('profile/pbx_config/password', value)
      }
    },

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
          false: this.$tc('Cancel'),
          true: this.$tc('Yes')
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

    onBtnSavePBXConfigClick () {
      this.$data.processSave = true
      this.$store.dispatch('profile/pbx_config/save')
        .then(() => (this.$toast.success('Changes accepted')))
        .catch(() => {
          this.$toast.error('An error occurred while saving')
        })
        .finally(() => (this.$data.processSave = false))
    }
  }
})
</script>

<style scoped>

</style>

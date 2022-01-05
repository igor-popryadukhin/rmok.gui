<template>
  <v-sheet>
    <v-row>
      <v-col
        cols="12"
        xl="6"
        lg="6"
        md="6"
      >
        <app-tools>
          <template #left>
            <h3 class="grey--text">
              {{ $tc('Параметры подключения') }}
            </h3>
          </template>
        </app-tools>
        <v-divider />
        <v-form
          v-model="pbxConfigCredentialValid"
          lazy-validation
        >
          <v-row>
            <v-col
              cols="12"
            >
              <v-text-field
                v-model="pbxConfigCredentialDisplayName"
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
              class="d-flex d-inline-flex"
            >
              <v-select
                v-model="pbxConfigCredentialScheme"
                :label="$tc('Schema')"
                :items="schemas"
                item-text="title"
                item-value="value"
                class="mr-5"
                style="max-width: 100px"
              />
              <v-text-field
                v-model="pbxConfigCredentialServer"
                :label="$tc('Server address')"
                :hint="$tc('The address of your PBX server. For example: pbx.mycompany.ru:4445')"
                :rules="[rules.notBlank, rules.ipOrDomain]"
                class="mr-5"
                persistent-hint
                required
              />
              <v-text-field
                v-model="pbxConfigCredentialPort"
                :label="$tc('Port')"
                type="number"
                persistent-hint
                :rules="[rules.positive]"
                style="max-width: 100px"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
            >
              <v-text-field
                v-model="pbxConfigCredentialLogin"
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
              md="12"
            >
              <v-text-field
                v-model="pbxConfigCredentialPassword"
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
      </v-col>
      <v-col>
        <!-- ICE options -->
        <app-tools>
          <template #left>
            <h3 class="grey--text">
              {{ $tc('ICE options') }}
            </h3>
            <v-btn
              href="https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment"
              target="_blank"
              color="primary"
              icon
              x-small
            >
              <v-icon>
                mdi-information-outline
              </v-icon>
            </v-btn>
          </template>
          <template #right>
            <v-btn
              :loading="processSave"
              color="primary"
              outlined
              text
              tile
              small
              @click="onBtnSavePBXConfigurationClick"
            >
              {{ $tc('Save') }}
            </v-btn>
          </template>
        </app-tools>
        <v-divider />
        <div class="d-flex flex-column">
          <div>
            <v-radio-group
              v-model="rtcConfigurationBundlePolicy"
              label="SDP bundle"
            >
              <v-radio
                :label="$tc('Balanced')"
                value="balanced"
              />
              <v-radio
                :label="$tc('Max-compat')"
                value="max-compat"
              />
              <v-radio
                :label="$tc('Max-bundle')"
                value="max-bundle"
              />
            </v-radio-group>
          </div>
          <div>
            <v-radio-group
              v-model="rtcConfigurationIceTransportPolicy"
              :label="$tc('ice_transport_policy')"
            >
              <v-tooltip
                open-delay="1000"
                max-width="350"
                left
              >
                <template #activator="{ on, attrs }">
                  <v-radio
                    label="All"
                    value="all"
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <span>
                  {{ $tc('tooltip.ice_transport_policy_all') }}
                </span>
              </v-tooltip>
              <v-tooltip
                open-delay="1000"
                max-width="350"
                left
              >
                <template #activator="{ on, attrs }">
                  <v-radio
                    label="Relay"
                    value="relay"
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <span>
                  {{ $tc('tooltip.ice_transport_policy_relay') }}
                </span>
              </v-tooltip>
            </v-radio-group>
          </div>
          <div>
            <v-slider
              v-model="rtcConfigurationIceCandidatePoolSize"
              label="ICE Candidate Pool"
              max="10"
              ticks
              persistent-hint
            />
          </div>
          <div>
            <v-checkbox
              v-model="rtcConfigurationRtcpMuxPolicy"
              label="Мультиплексирование"
            />
          </div>
          <div>
            <v-text-field
              v-model="rtcConfigurationCandidateReadyTimeOut"
              :label="$tc('ice_candidate_ready')"
              type="number"
              style="max-width: 250px"
            >
              <template #append>
                ms
              </template>
            </v-text-field>
          </div>
        </div>
        <!-- ICE options -->

        <!-- ICE servers -->
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

        <template v-if="rtcConfigurationIceServers.length > 0">
          <v-list
            max-width="800"
            class="mb-5"
            dense
          >
            <template v-for="(item, index) in rtcConfigurationIceServers">
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
                v-show="rtcConfigurationIceServers.length > 1"
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
        <!-- ICE servers -->
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import AppICEServerEditor from '@/components/AppICEServerEditor/AppICEServerEditor.vue'
import Vue from 'vue'
import rules from '@/mixins/rules'
import { mapGetters } from 'vuex'

export default Vue.extend({

  mixins: [rules],

  data () {
    return {
      pbxConfigCredentialValid: false,
      password: {
        visible: false
      },
      processCredentialSave: false,
      processSave: false
    }
  },

  computed: {
    ...mapGetters({
      userEditId: 'users_edit/id',
      rtcConfigurationIceServers: 'users_edit/pbx_configuration/rtc_configuration/ice_servers'
    }),

    pbxConfigCredentialDisplayName: {
      get () {
        return this.$store.getters['users_edit/pbx_configuration/credentials/display_name']
      },
      set (value: string) {
        return this.$store.commit('users_edit/pbx_configuration/credentials/display_name', value)
      }
    },
    pbxConfigCredentialScheme: {
      get () {
        return this.$store.getters['users_edit/pbx_configuration/credentials/schema']
      },
      set (value: string) {
        return this.$store.commit('users_edit/pbx_configuration/credentials/schema', value)
      }
    },
    pbxConfigCredentialServer: {
      get () {
        return this.$store.getters['users_edit/pbx_configuration/credentials/server']
      },
      set (value: string) {
        return this.$store.commit('users_edit/pbx_configuration/credentials/server', value)
      }
    },
    pbxConfigCredentialPort: {
      get () {
        return this.$store.getters['users_edit/pbx_configuration/credentials/port']
      },
      set (value: number) {
        return this.$store.commit('users_edit/pbx_configuration/credentials/port', +value)
      }
    },
    pbxConfigCredentialLogin: {
      get () {
        return this.$store.getters['users_edit/pbx_configuration/credentials/login']
      },
      set (value: string) {
        return this.$store.commit('users_edit/pbx_configuration/credentials/login', value)
      }
    },
    pbxConfigCredentialPassword: {
      get () {
        return this.$store.getters['users_edit/pbx_configuration/credentials/password']
      },
      set (value: string) {
        return this.$store.commit('users_edit/pbx_configuration/credentials/password', value)
      }
    },
    rtcConfigurationBundlePolicy: {
      get () {
        return this.$store.getters['users_edit/pbx_configuration/rtc_configuration/bundle_policy']
      },
      set (value: 'balanced' | 'max-bundle' | 'max-compat') {
        return this.$store.commit('users_edit/pbx_configuration/rtc_configuration/bundle_policy', value)
      }
    },
    rtcConfigurationIceTransportPolicy: {
      get () {
        return this.$store.getters['users_edit/pbx_configuration/rtc_configuration/ice_transport_policy']
      },
      set (value: 'all' | 'relay') {
        return this.$store.commit('users_edit/pbx_configuration/rtc_configuration/ice_transport_policy', value)
      }
    },
    rtcConfigurationIceCandidatePoolSize: {
      get () {
        return this.$store.getters['users_edit/pbx_configuration/rtc_configuration/ice_candidate_pool_size']
      },
      set (value: number) {
        return this.$store.commit('users_edit/pbx_configuration/rtc_configuration/ice_candidate_pool_size', value)
      }
    },
    rtcConfigurationRtcpMuxPolicy: {
      get () {
        return this.$store.getters['users_edit/pbx_configuration/rtc_configuration/rtcp_mux_policy']
      },
      set (value: boolean) {
        return this.$store.commit('users_edit/pbx_configuration/rtc_configuration/rtcp_mux_policy', value ? 'require' : null)
      }
    },

    rtcConfigurationCandidateReadyTimeOut: {
      get () {
        return +this.$store.getters['users_edit/pbx_configuration/rtc_configuration/candidate_ready_timeout']
      },
      set (value: number|string) {
        return this.$store.commit('users_edit/pbx_configuration/rtc_configuration/candidate_ready_timeout', +value)
      }
    },

    schemas () {
      return [
        {
          title: 'wss://',
          value: 'wss'
        },
        {
          title: 'ws://',
          value: 'ws'
        }
      ]
    }

  },

  methods: {
    /**
     * Срабатывает когда нажали на кнопку удалить, элемента списка ICE серверов.
     * @param urls
     * @param index
     */
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
          const servers: Array<Record<string, string|string[]>> = this.rtcConfigurationIceServers
            .map((e) => {
              return {
                credential: e.credential,
                credential_type: e.credential_type || 'password',
                urls: e.urls,
                username: e.username
              }
            })

          servers.splice(index, 1)
          this.$store.commit('users_edit/pbx_configuration/rtc_configuration/ice_servers', servers)
        }
      })
    },

    /**
     * @param item
     * @param index
     */
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
            const servers: Array<Record<string, string|string[]>> = this.rtcConfigurationIceServers
              .map((e) => {
                return {
                  credential: e.credential,
                  credential_type: e.credential_type || 'password',
                  urls: e.urls,
                  username: e.username
                }
              })

            servers[index].username = value.username
            servers[index].credential = value.password
            servers[index].urls = value.urls
              .replace(/\s+/, '')
              .split(',')
              .map(e => e.trim())

            this.$store.commit('users_edit/pbx_configuration/rtc_configuration/ice_servers', servers)
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
            const servers: Array<Record<string, string|string[]>> = this.rtcConfigurationIceServers
              .map((e) => {
                return {
                  credential: e.credential,
                  credential_type: e.credential_type || 'password',
                  urls: e.urls,
                  username: e.username
                }
              })

            servers.push({
              username: value.username,
              credential: value.password,
              credential_type: 'password',
              urls: value.urls
                .replace(/\s+/, '')
                .split(',')
                .map(e => e.trim())
            })

            this.$store.commit('users_edit/pbx_configuration/rtc_configuration/ice_servers', servers)
          }
          dialog.close()
        }
      })
    },

    onBtnSavePBXConfigurationClick () {
      this.$data.processSave = true
      this.$store.dispatch('users_edit/save_pbx_configuration')
        .then(() => (this.$toast.success('Changes accepted')))
        .catch(() => {
          this.$toast.error('An error occurred while saving')
        }).finally(() => (this.$data.processSave = false))
    }
  }
})
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {
    "ice_transport_policy": "Транспортная политика ICE",
    "ice_candidate_ready": "Завершить опрос кандидатов через",
    "ice_candidate_ready_timeout": "Время ожидания завершения сбора ICE кандидатов (ms)",
    "tooltip": {
      "ice_transport_policy_all": "Будут рассмотрены все кандидаты ICE.",
      "ice_transport_policy_relay": "Будут рассмотрены только кандидаты ICE, IP-адреса которых ретранслируются, например, проходящие через сервер STUN или TURN."
    }
  },
  "en": {
    "ice_transport_policy": "The current ICE transport policy",
    "ice_candidate_ready": "Complete the candidate survey through",
    "ice_candidate_ready_timeout": "Waiting time for the completion of the collection of ICE candidates (ms)",
    "tooltip": {
      "ice_transport_policy_all": "All ICE candidates will be considered.",
      "ice_transport_policy_relay": "Only ICE candidates whose IP addresses are being relayed, such as those being passed through a STUN or TURN server, will be considered."
    }
  }
}
</i18n>

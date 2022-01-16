<template>
  <v-container
    class="mt-5"
    style="max-width: 500px;"
  >
    <!--<editor-fold desc="Параметры подключения">-->
    <h3 class="grey--text">
      {{ $tc('Параметры подключения') }}
    </h3>
    <v-divider class="mb-5" />
    <div class="mb-5">
      <v-text-field
        v-model="credentialsDisplayName"
        :label="$tc('SIP phone number')"
        :hint="$tc('The phone number that is displayed when calling from your PBX')"
        persistent-hint
        dense
        outlined
        flat
      />

      <v-text-field
        v-model="credentialsLogin"
        :label="$tc('Login')"
        :hint="$tc('Login to access your PBX. For example: 003452')"
        persistent-hint
        dense
        outlined
        flat
      />
      <v-text-field
        v-model="credentialsPassword"
        :label="$tc('Password')"
        :hint="$tc('PBX access password')"
        autocomplete="new-password"
        persistent-hint
        required
        dense
        outlined
        flat
      />

      <v-text-field
        v-model="credentialsServer"
        :label="$tc('Server address')"
        :hint="$tc('The address of your PBX server. For example: pbx.mycompany.ru:4445')"
        class="mr-5"
        persistent-hint
        required
        outlined
        dense
      />
      <div class="d-flex flex-row">
        <v-select
          v-model="credentialsSchema"
          :label="$tc('Schema')"
          :items="schemas"
          item-text="title"
          item-value="value"
          class="mr-5"
          outlined
          dense
        />
        <v-text-field
          v-model="credentialsPort"
          :label="$tc('Port')"
          type="number"
          persistent-hint
          required
          outlined
          dense
        />
      </div>
    </div>
    <!--</editor-fold>-->

    <!--<editor-fold desc="ICE Параметры">-->
    <h3 class="grey--text">
      {{ $tc('ICE options') }}
    </h3>
    <v-divider class="mb-5" />
    <div class="mb-5">
      <v-radio-group
        v-model="rtcBundlePolicy"
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
      <v-radio-group
        v-model="rtcICETransportPolicy"
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
      <div>
        <v-slider
          v-model="rtcICECandidatePoolSize"
          label="ICE Candidate Pool"
          max="10"
          ticks
          persistent-hint
        />
      </div>
      <div>
        <v-checkbox
          v-model="rtcMuxPolicy"
          label="Мультиплексирование"
        />
      </div>
      <div>
        <v-text-field
          v-model="rtcCandidateReadyTimeOut"
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
    <!--</editor-fold>-->

    <!--<editor-fold desc="ICE Серверы">-->
    <div class="mb-5">
      <div class="d-flex justify-space-between">
        <div>
          <h3 class="grey--text">
            {{ $tc('ICE Серверы') }}
          </h3>
        </div>
        <div>
          <app-i-c-e-server-editor-dialog
            @click:save="onICEServerDialogSave(-1, $event)"
          >
            <template #activator="{ on }">
              <v-btn
                x-small
                tile
                text
                outlined
                v-on="on"
              >
                {{ $tc('Add') }}
              </v-btn>
            </template>
          </app-i-c-e-server-editor-dialog>
        </div>
      </div>
      <v-divider class="mb-1" />
      <div
        v-if="rtcICEServers.length === 0"
        class="d-flex align-center justify-center fill-height"
        style="height: 64px"
      >
        <span class="grey--text">
          {{ $tc('ICE Servers not installed') }}
        </span>
      </div>
      <v-list v-else>
        <template v-for="(item, itemIndex) in rtcICEServers">
          <v-divider
            v-if="itemIndex>0"
            :key="`v-divider-${itemIndex}`"
          />
          <v-list-item
            :key="`v-list-item-${itemIndex}`"
            link
          >
            <v-list-item-content>
              <v-list-item-title v-if="Array.isArray(item.urls)">
                {{ item.urls.join(', ') }}
              </v-list-item-title>
              <v-list-item-title v-else>
                {{ item.urls }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="d-flex flex-row">
              <app-i-c-e-server-editor-dialog
                :urls="item.urls.join(', ')"
                :username="item.username"
                :credential="item.credential"
                @click:save="onICEServerDialogSave(itemIndex, $event)"
              >
                <template #activator="{ on }">
                  <v-btn
                    class="mr-2"
                    tile
                    icon
                    x-small
                    v-on="on"
                  >
                    <v-icon>mdi-square-edit-outline</v-icon>
                  </v-btn>
                </template>
              </app-i-c-e-server-editor-dialog>
              <app-confirm-dialog
                text="Вы хотите удалить ICE сервер?"
                @click:confirm="deleteICEServer(itemIndex)"
              >
                <template #activator="{ on }">
                  <v-btn
                    tile
                    icon
                    x-small
                    v-on="on"
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
              </app-confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </div>
    <!--    <app-i-c-e-server-editor />-->
    <!--</editor-fold>-->

    <v-divider class="mb-2" />

    <div class="mb-5">
      <v-btn
        :loading="conservationProcess"
        :disabled="!isChanged"
        tile
        text
        outlined
        @click="onBtnSaveChangeClick"
      >
        {{ $tc('Save change') }}
      </v-btn>
    </div>

    <div style="margin-bottom: 200px" />
  </v-container>
</template>

<script lang="ts">

import APIError from '@/api/classes/APIError'
import PBXConfiguration, { Credentials, RTCConfiguration, RTCIceServer } from '@/api/interfaces/PBXConfiguration'
import AppBase from '@/AppBase'
import AppConfirmDialog from '@/components/AppConfirmDialog/AppConfirmDialog.vue'
import AppPellEditor from '@/components/AppPellEditor/AppPellEditor.vue'
import { $axios } from '@/plugins/axios'
import ProjectsItems from '@/views/Projects/ProjectsItems.vue'
import ProjectsTools from '@/views/Projects/ProjectsTools.vue'
import { AxiosResponse } from 'axios'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<UsersViewTelephony>({
  components: {
    AppConfirmDialog,
    AppICEServerEditorDialog: () => import('@/components/AppICEServerEditor/AppICEServerEditorDialog.vue'),
    AppPellEditor,
    ProjectsTools,
    ProjectsItems
  }
})
export default class UsersViewTelephony extends AppBase {
  conservationProcess = false
  oldFormState = null

  get pbxConfig (): PBXConfiguration { return this.$store.getters['users/view/user_pbx_configuration'] }
  get credentials (): Credentials { return this.pbxConfig.credentials }
  get rtcConfiguration (): RTCConfiguration { return this.pbxConfig.rtc_configuration }

  // Параметры подключения
  get credentialsDisplayName (): string { return this.credentials.display_name }
  set credentialsDisplayName (val: string) {
    this.$store
      .commit('users/view/user_pbx_configuration_credentials', Object.assign(
        JSON.parse(JSON.stringify(this.credentials)), { display_name: val }
      ))
  }

  get credentialsLogin (): string { return this.credentials.login }
  set credentialsLogin (val: string) {
    this.$store
      .commit('users/view/user_pbx_configuration_credentials', Object.assign(
        JSON.parse(JSON.stringify(this.credentials)), { login: val }
      ))
  }

  get credentialsPassword (): string { return this.credentials.password }
  set credentialsPassword (val: string) {
    this.$store
      .commit('users/view/user_pbx_configuration_credentials', Object.assign(
        JSON.parse(JSON.stringify(this.credentials)), { password: val }
      ))
  }

  get credentialsServer (): string { return this.credentials.server }
  set credentialsServer (val: string) {
    this.$store
      .commit('users/view/user_pbx_configuration_credentials', Object.assign(
        JSON.parse(JSON.stringify(this.credentials)), { server: val }
      ))
  }

  get credentialsSchema (): string { return this.credentials.schema }
  set credentialsSchema (val: string) {
    this.$store
      .commit('users/view/user_pbx_configuration_credentials', Object.assign(
        JSON.parse(JSON.stringify(this.credentials)), { schema: val }
      ))
  }

  get credentialsPort (): number { return this.credentials.port }
  set credentialsPort (val: number) {
    this.$store
      .commit('users/view/user_pbx_configuration_credentials', Object.assign(
        JSON.parse(JSON.stringify(this.credentials)), { port: val }
      ))
  }
  // Параметры подключения

  // ICE
  get rtcBundlePolicy (): 'balanced' | 'max-bundle' | 'max-compat' { return this.rtcConfiguration.bundle_policy }
  set rtcBundlePolicy (val: 'balanced' | 'max-bundle' | 'max-compat') {
    this.$store
      .commit('users/view/user_pbx_configuration_rtc_configuration', Object.assign(
        JSON.parse(JSON.stringify(this.rtcConfiguration)), { bundle_policy: val }
      ))
  }

  get rtcICETransportPolicy (): 'all' | 'relay' { return this.rtcConfiguration.ice_transport_policy }
  set rtcICETransportPolicy (val: 'all' | 'relay') {
    this.$store
      .commit('users/view/user_pbx_configuration_rtc_configuration', Object.assign(
        JSON.parse(JSON.stringify(this.rtcConfiguration)), { ice_transport_policy: val }
      ))
  }

  get rtcICECandidatePoolSize (): number { return this.rtcConfiguration.ice_candidate_pool_size }
  set rtcICECandidatePoolSize (val: number) {
    this.$store
      .commit('users/view/user_pbx_configuration_rtc_configuration', Object.assign(
        JSON.parse(JSON.stringify(this.rtcConfiguration)), { ice_candidate_pool_size: val }
      ))
  }

  get rtcMuxPolicy (): 'require' | undefined { return this.rtcConfiguration.rtcp_mux_policy }
  set rtcMuxPolicy (val: 'require' | undefined) {
    this.$store
      .commit('users/view/user_pbx_configuration_rtc_configuration', Object.assign(
        JSON.parse(JSON.stringify(this.rtcConfiguration)), { rtcp_mux_policy: val }
      ))
  }

  get rtcCandidateReadyTimeOut (): number { return this.rtcConfiguration.candidate_ready_timeout }
  set rtcCandidateReadyTimeOut (val: number) {
    this.$store
      .commit('users/view/user_pbx_configuration_rtc_configuration', Object.assign(
        JSON.parse(JSON.stringify(this.rtcConfiguration)), { candidate_ready_timeout: +val }
      ))
  }

  // eslint-disable-next-line no-undef
  get rtcICEServers (): RTCIceServer[] { return this.$store.getters['users/view/user_pbx_configuration_rtc_configuration_ice_servers'] }
  // ICE

  get isChanged () {
    return this.oldFormState !== JSON.stringify(this.pbxConfig)
  }

  get schemas () {
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

  public mounted () {
    this.oldFormState = JSON.stringify(this.pbxConfig)
  }

  private onBtnSaveChangeClick () {
    this.conservationProcess = true
    $axios.patch(`/users/${this.$route.params.id}`, {
      pbx_configuration: this.pbxConfig
    }).then((response: AxiosResponse) => {
      if (![200, 204].includes(response.status)) {
        throw new APIError(response.data)
      }

      this.oldFormState = JSON.stringify(this.pbxConfig)
      this.$toast.success('Changes accepted')
    }).catch((reason) => {
      if (reason instanceof APIError) {
        reason.errors.forEach((e) => {
          this.$toast.error(e.message)
        })
      } else {
        this.$toast.error(reason.message)
      }
    }).finally(() => (this.conservationProcess = false))
  }

  private onICEServerDialogSave (index: number, data) {
    const iceServers = JSON.parse(JSON.stringify(this.rtcICEServers)) as RTCIceServer[]

    if (index === -1) {
      iceServers.push({
        urls: String(data.urls).split(',').map((e) => e.trim()),
        username: data.username,
        credential: data.credential,
        credential_type: 'password'
      })

      this.$store
        .commit('users/view/user_pbx_configuration_rtc_configuration_ice_servers', iceServers)
    } else {
      iceServers[index].username = data.username
      iceServers[index].urls = String(data.urls).split(',').map((e) => e.trim())
      iceServers[index].credential = data.credential

      this.$store
        .commit('users/view/user_pbx_configuration_rtc_configuration_ice_servers', iceServers)
    }
  }

  /**
   *
   * @param index
   */
  deleteICEServer (index: number) {
    // eslint-disable-next-line no-undef
    const iceServers = JSON.parse(JSON.stringify(this.rtcICEServers)) as RTCIceServer[]

    if (typeof iceServers[index] !== 'undefined') {
      iceServers.splice(index, 1)
      this.$store
        .commit('users/view/user_pbx_configuration_rtc_configuration_ice_servers', iceServers)
    }
  }
}
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

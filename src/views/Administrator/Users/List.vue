<template>
  <div>
    <v-toolbar
      flat
      class="pl-3"
    >
      <v-spacer />
      <!-- Add new user -->
      <v-tooltip bottom max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            :to="{ name: 'administrator_users_new' }"
            v-on="on"
            v-bind="attrs"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>{{ $tc('Add new user') }}</span>
      </v-tooltip>
    </v-toolbar>
    <v-row class="ma-0">
      <v-col
        cols="12"
      >
        <vuescroll
          :ops="vueScrollOptions"
          :style="{ height: `${$screenHeight - 215}px` }"
          style="width: 100%"
          @handle-scroll-complete="onVueScrollHandleComplete"
        >
          <template v-if="users.length > 0">
            <template
              v-for="item in users"
            >
              <v-divider
                :key="`divider-${item.id}`"
              />
              <v-list-item
                :key="`list-item-${item.id}`"
                ripple
                selectable
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.first_name }} {{ item.last_name }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="item.role">
                    {{ $tc('Role | Roles', 0) }}: {{ item.role.name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>
                    Без роли
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="item.group">
                    {{ $tc('Group | Groups', 0) }}: {{ item.group.name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>
                    {{ $tc('Group | Groups', 0) }}: —
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="item.organization">
                    {{ $tc('Organization | Organizations', 0) }}: {{ item.organization.name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>
                    {{ $tc('Organization | Organizations', 0) }}: —
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer />
                <v-list-item-group v-if="item.project">
                  <v-list-item-title>
                    {{ item.project.name }}
                  </v-list-item-title>
                </v-list-item-group>
                <v-list-item-action>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        large
                        v-bind="attrs"
                        v-on.stop="on"
                      >
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        :to="{ name: 'administrator_users_edit', params: { id: item.id } }"
                        link
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-square-edit-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Редактировать</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        link
                        @click.stop="testingCallDialogShow(item.id)"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-test-tube</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>{{ $tc('Outgoing call testing') }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </template>
          </template>
          <template v-else-if="organizationsProcessLoading">
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">
                {{ $tc('Loading content...') }}
              </span>
              <v-spacer />
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">
                {{ $tc('users_list_empty') }}
              </span>
              <v-spacer />
            </v-list-item>
          </template>
        </vuescroll>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-dialog
        v-model="testingCallDialog.visible"
        persistent
        max-width="900px"
        fullscreen
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="testingCallDialog.visible = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ $tc('Outgoing call testing') }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col
                  cols="12"
                  md="5"
                  lg="5"
                >
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        v-model="testingCallDialog.pbx_config.display_name"
                        :label="$tc('SIP phone number')"
                        :hint="$tc('The phone number that is displayed when calling from your PBX')"
                        persistent-hint
                        counter
                      >
                        <template
                          v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
                          v-slot:prepend
                        >
                          <v-icon class="pl-5 pr-9">mdi-account-circle</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="10"
                    >
                      <v-text-field
                        v-model="testingCallDialog.pbx_config.server"
                        :label="$tc('Server address')"
                        :hint="$tc('The address of your PBX server. For example: pbx.mycompany.ru')"
                        persistent-hint
                        required
                      >
                        <template
                          v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
                          v-slot:prepend
                        >
                          <v-icon class="pl-5 pr-9">mdi-domain</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="2"
                    >
                      <v-text-field
                        v-model="testingCallDialog.pbx_config.port"
                        :label="$tc('Port')"
                        type="number"
                        persistent-hint
                        required
                        single-line
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        v-model="testingCallDialog.pbx_config.login"
                        :label="$tc('Login')"
                        :hint="$tc('Login to access your PBX. For example: 003452')"
                        persistent-hint
                        required
                      >
                        <template
                          v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
                          v-slot:prepend
                        >
                          <v-icon class="pl-5 pr-9">mdi-account-key</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        v-model="testingCallDialog.pbx_config.password"
                        :label="$tc('Password')"
                        :hint="$tc('PBX access password')"
                        :type="testingCallDialog.pbxPasswordVisible ? '' : 'password'"
                      >
                        <template
                          v-if="['lg', 'md'].includes($vuetify.breakpoint.name)"
                          v-slot:prepend
                        >
                          <v-icon class="pl-5 pr-9">mdi-form-textbox-password</v-icon>
                        </template>
                        <template v-slot:append>
                          <v-btn
                            v-if="testingCallDialog.pbxPasswordVisible"
                            icon
                            @click="testingCallDialog.pbxPasswordVisible = false"
                          >
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                          <v-btn
                            v-else
                            icon
                            @click="testingCallDialog.pbxPasswordVisible = true"
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
                        color="blue darken-1"
                        text
                        @click="connect"
                      >
                        {{ $tc('Connect') }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        v-model="testingCallDialog.target"
                        :label="$tc('Subscriber\'s phone number to whom we are calling')"
                        placeholder="+79250000000"
                        persistent-hint
                      >
                        <template v-slot:append-outer>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="testCall(testingCallDialog.target)"
                          >
                            {{ $tc('Call') }}
                          </v-btn>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <vuescroll
                        :ops="vueScrollOptions"
                        :style="{ height: `${500}px` }"
                        style="width: 100%"
                      >
                        <template
                          v-for="(item, index) in testingCallDialog.log"
                        >
                          <v-divider
                            :key="`divider-${index}`"
                          />
                          <v-list-item
                            :key="`list-item-${index}`"
                            ripple
                            selectable
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ item.title }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </vuescroll>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserInterface, Users } from '@/api/Users'
import vuescroll from 'vuescroll'
import vueScrollOptions from '@/mixins/vueScrollOptions'
import PBXInterface from '@/api/Schemas/PBXInterface'
import { ConnectingEvent, EndEvent, IncomingEvent, OutgoingEvent, RTCSession } from 'jssip/lib/RTCSession'
import { ConnectedEvent, UnRegisteredEvent } from 'jssip/lib/UA'

export default Vue.extend({

  mixins: [
    vueScrollOptions
  ],

  components: {
    vuescroll
  },

  data () {
    return {
      users: [] as UserInterface[],
      organizationsProcessLoading: false,
      testingCallDialog: {
        visible: false,
        pbxPasswordVisible: false,
        pbx_config: {
          display_name: '',
          login: '',
          password: '',
          port: 0,
          server: ''
        } as PBXInterface,
        target: '',
        log: [] as any[]
      }
    }
  },

  created () {
    this.organizationsProcessLoading = true
    new Users()
      .find()
      .then((users: any) => {
        this.users = users.items
      }).finally(() => {
        this.organizationsProcessLoading = false
      })
  },

  methods: {

    log (data: any) {
      this.testingCallDialog.log.push(data)
    },

    connect () {
      if (this.$jsSIP.isConnected) {
        this.$jsSIP.stop()
      }
      this.$jsSIP.setConfiguration(`wss://${this.testingCallDialog.pbx_config.server}:${this.testingCallDialog.pbx_config.port}/ws`, {
        uri: `sip:${this.testingCallDialog.pbx_config.login}@${this.testingCallDialog.pbx_config.server}`,
        password: this.testingCallDialog.pbx_config.password
      }).on('connected', this.onJsSIPConnected)
        .on('disconnected', this.onJsSIPDisconnected)
        .on('registered', this.onJsSIPRegistered)
        .on('registrationFailed', this.onJsSIPRegistrationFailed)
        .on('sipEvent', this.onJsSIPSipEvent)
        .on('newMessage', this.onJsSIPNewMessage)

      // Event Disconnected can happen later than Connected
      setTimeout(() => {
        this.$jsSIP.start()
      }, 500)

      // This is the global session handler.
      this.$jsSIP.onSessionConnecting = (session: RTCSession, event: ConnectingEvent, payload: any) => {
        console.log('%c%s', 'color: blue;', 'Начало сессии')
      }

      this.$jsSIP.onSessionProgress = async (session: RTCSession, event: IncomingEvent | OutgoingEvent) => {
        this.log({
          title: session.id
        })
      }

      // this.$jsSIP.onSessionAccepted = (session: RTCSession, event: IncomingEvent | OutgoingEvent, payload: any) => {
      //
      // }

      this.$jsSIP.onSessionEnded = (session: RTCSession, event: EndEvent, payload: any) => {
        /* eslint-disable */
        /* eslint-enable */
      }

      this.$jsSIP.onSessionFailed = (session: RTCSession, event: EndEvent, payload: any) => {
        /* eslint-disable */
        // this.$root.$emit('jssip-session-cancel', { session, payload })
        // console.log('onSessionFailed...', event.cause)
        /* eslint-enable */
      }
    },

    testCall (target: string) {
      this.$jsSIP.call(target)
    },

    /**
     * Показать тестовый диалог
     */
    testingCallDialogShow (id: number) {
      new Users()
        .getById(id)
        .then((user: UserInterface) => {
          this.testingCallDialog.pbx_config = user.pbx_config ?? {
            display_name: '',
            login: '',
            password: '',
            port: 0,
            server: ''
          }
        })
      this.testingCallDialog.visible = true
    },

    onVueScrollHandleComplete (data: any) {
      console.log(data)
    },

    onJsSIPConnected (event: ConnectedEvent) {
      this.log({
        title: event.socket.url
      })
    },

    onJsSIPDisconnected (event: any) {
      console.log('%c%s', 'color: green;', 'JSSIP Disconnected')
    },

    onJsSIPRegistered (event: any) {
      this.log({
        title: 'Клиент зарегистрирован на сервере.'
      })
    },

    onJsSIPRegistrationFailed (event: UnRegisteredEvent) {
      console.log('%c%s', 'color: red;', 'JSSIP Failed: ' + event.cause)
    },

    onJsSIPSipEvent (event: any) {
      console.log(event)
    },

    onJsSIPNewMessage (event: any) {
      console.log('%c%s', 'color: green;', 'JSSIP NewMessage', event)
    }
  }
})
</script>

<style scoped>

</style>

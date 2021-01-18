<template>
  <v-app id="inspire">
    <v-app-bar
        app
        dark
        flat
        elevation="2"
        fixed
        clipped-left
        clipped-right
        extended
        extension-height="25px"
        class="background--header"
    >
      <div class="offset-lg-1 offset-md-1"></div>
      <v-toolbar-title>
        <span class="hidden-sm-and-down">RMOK</span>
      </v-toolbar-title>
      <v-spacer/>

      <!-- Main search -->
      <v-autocomplete
          v-model="mainSearch.selected"
          :items="mainSearch.items"
          :search-input.sync="mainSearch.q"
          item-text="title"
          return-object
          hide-no-data
          no-filter
          clearable
          disable-lookup
          flat
          hide-selected
          class="mr-4"
          :label="$t('search')"
          :loading="mainSearch.loading"
          hide-details
          outlined
          dense
      >
        <template
            v-slot:no-data
        >
          <div class="pa-4">
            {{ $t('Your search - {q} - did not match any documents.', {q: mainSearch.q}) }}
          </div>
        </template>
        <template
            v-slot:prepend-inner
        >
          <v-icon>mdi-magnify</v-icon>
        </template>
        <template v-slot:selection="{ item }">
          <span>{{ item.name }}</span>
        </template>
        <template v-slot:item="{ item }">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle v-if="item.subtitle" v-text="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-autocomplete>

      <v-toolbar-items style="height: 40px">
        <template
            v-for="(item, mainMenuIndex) in mainMenu"
        >
          <v-menu
              v-if="item.menu"
              :key="mainMenuIndex"
              offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  class="mr-3"
                  :class="['call_center_manager_reports_recent_calls', 'call_center_manager_reports_all_calls'].includes($route.name) ? 'v-btn--active' : ''"
                  v-on="on"
                  v-bind="attrs"
                  text
              >
                {{ $tc('Statistic') }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                  v-for="(item, index) in item.menu"
                  :key="`${mainMenuIndex}-${index}`"
                  :to="item.to"
              >
                <v-list-item-icon v-if="item.icon">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
                  <v-list-item-subtitle v-if="item.subtitle">{{ $t(item.subtitle) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
              v-else
              :key="mainMenuIndex"
              :class="item.class || ''"
              :to="item.to"
              text
          >
            {{ $tc('route.' + item.to.name) }}
          </v-btn>
        </template>
      </v-toolbar-items>

      <!-- BELL -->
      <v-menu
          v-model="buttonMenuNotification"
          :close-on-content-click="false"
          nudge-left="150"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              class="mr-1 ml-1"
              icon
              v-bind="attrs"
              v-on="on"
          >
            <v-icon>mdi-bell</v-icon>
            <v-badge
                v-if="notifications.length > 0"
                color="red"
                :content="notifications.length"
            />
          </v-btn>
        </template>
        <v-card v-if="notifications.length > 0">
          <v-list>
            <v-list-item
                v-for="(item, itemIndex) in notifications"
                :key="itemIndex"
                link
            >
              <v-list-item-avatar>
                <v-icon :color="item.color">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.message }}</v-list-item-subtitle>
                <v-list-item-subtitle v-if="item.message2">{{ item.message2 }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action v-if="item.actions.length > 0">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attr }">
                    <v-btn
                        icon
                        v-on.stop="on"
                        v-bind="attr"
                    >
                      <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                        v-for="(action, actionIndex) in item.actions"
                        :key="actionIndex"
                        link
                        @click="action.handle(action.arg)"
                        @mouseup="buttonMenuNotification = false"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ action.title }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <div style="width: 10px"></div>

      <!-- Avatar -->
      <v-menu offset-y min-width="300">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              large
              v-bind="attrs"
              v-on="on"
          >
            <v-avatar
                color="#ff9800e3"
                style="color: white; font-size: 20px"
                item
            >
              {{ avatar }}
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
              v-for="(item, index) in items"
              :key="index"
              :to="item.to"
              @click="item.click ? item.click : () => {}"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t(item.name) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <div class="offset-lg-1 offset-md-1"></div>
      <template v-slot:extension>
        <v-breadcrumbs
            :items="breadcrumbs"
            class="offset-lg-1 col-lg-10 offset-md-1 col-md-10 pa-0"
        >
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
                v-if="!item.latest"
                ripple
                :href="item.path"
            >
              <span style="color: white !important;">{{ $t(item.title).toUpperCase() }}</span>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item v-else>
              <span style="color: white !important;">{{ $t(item.title).toUpperCase() }}</span>
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </template>
    </v-app-bar>
    <v-main>
      <v-container
          class="offset-lg-1 col-lg-10 offset-md-1 col-md-10"
      >
        <router-view/>
      </v-container>
    </v-main>

    <v-dialog
        v-model="projectDialog.visible"
        persistent
        :max-width="projectDialogWidth"
        :disabled="projectDialog.disabled"
    >
      <v-card>
        <v-card-title class="headline">
          Выберите проект
        </v-card-title>
        <v-card-text class="pb-10">
          <v-list
              subheader
              :disabled="projectDialog.disabled"
          >
            <template
                v-for="item in projectDialog.projects"
            >
              <v-list-item
                  :key="`v-list-item-${item.id}`"
                  link
                  @click="onProjectItemClick(item)"
              >
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
                <v-list-item-action>
                  <v-progress-circular
                      v-if="item.loading"
                      indeterminate
                      size="22"
                      width="2"
                      color="grey"
                  />
                </v-list-item-action>
              </v-list-item>
              <v-divider :key="`v-divider-${item.id}`"/>
            </template>
          </v-list>
          <div class="v-messages__wrapper">
            <div class="v-messages__message grey--text">
              {{ $tc('Select the desired item from the list') }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import breadcrumbs from '@/mixins/breadcrumbs'
import { MainSearchInterface, NotificationInterface } from '@/Interfaces'
import { debounce } from 'vuetify/src/util/helpers'
import Tasks, { TaskGetResponseInterface, TaskInterface, TaskType } from '@/api/Tasks'
import Projects, { ProjectInterface } from '@/api/Projects'
import Users from '@/api/Users'
import { Configurations } from '@/api/Configurations'
import PBXInterface from '@/api/Schemas/PBXInterface'
import { ConnectingEvent, EndEvent, IncomingEvent, OutgoingEvent, RTCSession } from 'jssip/lib/RTCSession'
import { Contacts } from '@/api/Contacts'
import VStatusEditDialog, { StatusInterface } from '@/components/VStatusEditDialog/VStatusEditDialog.vue'
import { ConnectedEvent, IncomingRTCSessionEvent, OutgoingRTCSessionEvent, UnRegisteredEvent } from 'jssip/lib/UA'
import { DisconnectEvent } from 'jssip/lib/WebSocketInterface'
import VToast from '@/components/VToast/VToast.vue'
import IncomingRTCSession from '@/components/IncomingRTCSession/IncomingRTCSession.vue'
import { ToastOptions } from 'vue-toastification/dist/types/src/types'
import { POSITION } from 'vue-toastification'
import { JsSIP } from '@/jsSIP/plugin'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import JSSIPPayloadInterface from '@/interface/JSSIPPayloadInterface'

import callMachine from '@/xState/machines/callMachine'
import { interpret } from 'xstate'

interface HistoryDataInterface {
  /* eslint-disable */
  session_start_time: number;
  session_end_time: number;
  start_timestamp?: number;
  end_timestamp?: number;
  type: string;
  direction?: string;
  initiator?: string;
  target?: string;
  originator?: string;
  cause?: string;
  audio_record_id?: string;
  /* eslint-enable */
}

interface PropsInterface {
  source: string;
}

interface DataInterface {
  toastId: number | string;
  projectDialog: any;
  buttonMenuNotification: any;
  mainSearch: any;
  settings: any;
  dialog: any;
  drawer: any;
  items: any;
  mainMenu: any[];
  notifications: NotificationInterface[];
  projects: any;
  RTCToastOptions: ToastOptions,
  callMachineService: any
  current: any
  context: any
}

interface MethodsInterface {
  onRootNewTasks: () => void;
  jsSIPInitialize: () => void;
  onRootLoadingProjects: () => void;
  onProjectItemClick: (item: ProjectInterface & { loading: boolean }) => void;
  onJsSIPConnected: (event: any) => void;
  onJsSIPDisconnected: (event: any) => void;
  onJsSIPRegistered: (event: any) => void;
  onJsSIPRegistrationFailed: (event: any) => void;
  onJsSIPSipEvent: (event: any) => void;
  onJsSIPNewMessage: (event: any) => void;
  showRTCToast: (displayName: string, phoneNumber: string, id: string | number) => void;
  newRTCSession: (event: IncomingRTCSessionEvent | OutgoingRTCSessionEvent) => void;
  updateRTCToast: (toastId: string | number, displayName: string, phoneNumber: string) => void;
  onAnswer: () => void;
  onHangup: () => void;
  addHistory: <T>(contactId: number, historyData: any) => Promise<T>;
}

interface ComputedInterface {
  avatar: string;
  projectDialogWidth: string;
}

export default Vue.extend<DataInterface, MethodsInterface, ComputedInterface, PropsInterface>({
  props: {
    source: String
  },

  mixins: [breadcrumbs],

  data () {
    return {
      toastId: 0,
      projectDialog: {
        visible: false,
        projects: [] as ProjectInterface[],
        disabled: false
      },
      buttonMenuNotification: false,
      mainSearch: {
        q: null,
        selected: null,
        loading: false,
        items: [],
        debounce: debounce(function (q: string, _this: any) {
          _this.$root.$emit('root-main-search', q, (items: MainSearchInterface[]) => {
            _this.mainSearch.items = items
          })
        }, 400)
      },
      settings: {
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: false
      },
      dialog: false,
      drawer: null,
      items: [
        {
          name: 'route.operator_settings_profile',
          icon: 'mdi-account',
          to: {
            name: 'operator_settings_profile'
          }
        },
        {
          name: 'exit',
          icon: 'mdi-exit-run',
          to: {
            name: 'login'
          }
        }
      ],
      mainMenu: [
        { class: '', to: { name: 'operator_leads' } },
        { class: '', to: { name: 'operator_contacts_list' } },
        { class: '', to: { name: 'operator_calls' } },
        { class: '', to: { name: 'operator_reports' } },
        { class: '', to: { name: 'operator_help' } }
      ],
      notifications: [] as NotificationInterface[],
      projects: [],
      RTCToastOptions: {
        id: '',
        position: POSITION.TOP_RIGHT,
        timeout: false,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: false,
        draggablePercent: 0.47,
        hideProgressBar: false,
        toastClassName: 'incoming-rtc-toast',
        closeOnClick: false,
        closeButton: false,
        icon: false,
        rtl: false
      },

      // xState
      callMachineService: interpret(callMachine.withContext(this)),
      // Start with the machine's initial state
      current: callMachine.initialState,
      // Start with the machine's initial context
      context: callMachine.context
    }
  },

  watch: {
    'mainSearch.q': {
      handler (q: string) {
        this.mainSearch.debounce(q, this)
      }
    },

    'mainSearch.selected': {
      handler (value) {
        if (value) {
          this.$root.$emit('root-main-search-selected', value)
        }
      }
    },

    'projectDialog.projects': {
      handler (projects: ProjectInterface[] | any) {
        if (!Array.isArray(projects)) {
          return
        }
        if (projects.length === 0) {
          return
        }

        this.projectDialog.visible = true
      }
    }
  },

  computed: {
    avatar () {
      const first: string = this.$store.getters['profile/first_name'] || ''
      const last: string = this.$store.getters['profile/last_name'] || ''
      return first.charAt(0) + last.charAt(0)
    },

    // Ширина окна диалога для выбора проекта, зависит от размера экрана
    projectDialogWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 100 + '%'
        case 'sm':
          return 100 + '%'
        case 'md':
          return 60 + '%'
        case 'lg':
          return 40 + '%'
        default:
          return 100 + '%'
      }
    }
  },

  mounted () {
    this.$root.$on('root-update-notifications', this.onRootNewTasks)

    // Инициализация телефонии
    this.$root.$on('root-jssip-initialize', this.jsSIPInitialize)

    // Событие загрузки проектов для выбора
    this.$root.$on('root-loading-projects', this.onRootLoadingProjects)

    this.callMachineService = interpret(callMachine.withContext(this))
    this.callMachineService
      .onTransition((state) => {
        this.current = state
        this.context = state.context
      }).start()
  },

  created () {
    this.$store.subscribe(
      ({ payload, type }) => {
        if (type === 'project/set') {
          if (payload.statuses) {
            if (payload.statuses.length === 0) {
              this.$root.$emit('root-update-notifications')
            }
          }
        }
      }
    )

    setTimeout(() => {
      this.$root.$emit('root-update-notifications')
    }, 1000)
  },

  beforeDestroy () {
    this.$root.$off('root-update-notifications', this.onRootNewTasks)
    this.$root.$off('root-loading-projects', this.onRootLoadingProjects)
    this.$root.$off('root-jssip-initialize', this.jsSIPInitialize)
  },

  methods: {
    onRootNewTasks () {
      new Tasks()
        .get()
        .then((response: TaskGetResponseInterface) => {
          this.notifications = []
          if (this.$store.getters['project/statuses'].length === 0) {
            this.notifications.push({
              type: 'event',
              icon: 'mdi-alert',
              color: 'red',
              title: 'Ошибка проекта!',
              message: 'У проекта нет статусов',
              actions: []
            })
          }
          response.items.forEach((task: TaskInterface) => {
            if (!task.done) {
              let title = ''
              let icon = ''
              switch (task.type) {
                case TaskType.CALL: {
                  title = this.$tc('Call')
                  icon = 'mdi-alpha-c-circle'
                  break
                }
                case TaskType.TASK: {
                  title = this.$tc('Task')
                  icon = 'mdi-alpha-t-circle'
                  break
                }
                case TaskType.MEETING: {
                  title = this.$tc('Meeting')
                  icon = 'mdi-alpha-m-circle'
                  break
                }
                case TaskType.LETTER: {
                  title = this.$tc('Letter')
                  icon = 'mdi-alpha-e-circle'
                  break
                }
                case TaskType.OTHER: {
                  title = this.$tc('Other')
                  icon = 'mdi-alpha-o-circle'
                  break
                }
              }

              if (task.type === TaskType.CALL) {
                this.notifications.push({
                  type: 'task',
                  icon,
                  color: 'blue',
                  title,
                  message: task.description,
                  message2: `Позвонить в ${new Date(task.planned_for * 1000).toLocaleString()}`,
                  actions: [
                    {
                      title: 'Позвонить',
                      arg: task,
                      handle: (arg: TaskInterface) => {
                        if (arg.contact) {
                          this.$router.push({
                            name: 'operator_leads_script',
                            params: {
                              contact_id: String(arg.contact?.id)
                            }
                          })
                        } else {
                          console.error('Задача для контакта не содержит данные контакта')
                        }
                      }
                    }
                  ]
                })
              } else {
                this.notifications.push({
                  type: 'task',
                  icon,
                  color: 'blue',
                  title,
                  message: task.description,
                  message2: `Выполнить до ${new Date(task.planned_for * 1000).toLocaleString()}`,
                  actions: [
                    {
                      title: 'Выполнить',
                      arg: task,
                      handle: (arg: TaskInterface) => {
                        new Tasks()
                          .done(arg.id)
                          .then(() => {
                            this.$root.$emit('root-update-notifications')
                          })
                      }
                    }
                  ]
                })
              }
            }
          })
        })
    },

    /**
     * Происходит при каждом клике по элементу списка проектов в диалоговом окне
     *
     * @param item
     */
    onProjectItemClick (item: ProjectInterface & { loading: boolean }) {
      this.projectDialog.disabled = true
      item.loading = true
      new Users()
        .setProject(this.$store.getters['profile/id'], item.id)
        .then(() => {
          this.projectDialog.visible = false
          this.$store.dispatch('project/load')
        }).catch((e) => {
          console.log(e)
        }).finally(() => {
          item.loading = false
          this.projectDialog.disabled = false
        })
    },

    onRootLoadingProjects () {
      new Projects()
        .find<{ count: number }, ProjectInterface[]>({
          offset: 0,
          count: 100
        }).then((response) => {
          this.projectDialog.projects = response.data.map((e: any) => {
            e.loading = false
            return e
          }) || []
        })
    },

    // Телефония
    jsSIPInitialize () {
      if (this.$isDebug) {
        console.log('%c%s', 'color: green;', 'JsSIP: Инициализация...')
      }
      const libphonenumberInitialize = () => import(/* webpackChunkName: "libphonenumber-js-plugin" */ '@/plugins/libphonenumber-js')
      const jssipInitialize = () => import(/* webpackChunkName: "jssip-plugin" */ '@/jsSIP')
        .then(() => {
          if (this.$jsSIP.isConnected) {
            this.$jsSIP.stop()
          }
          new Configurations()
            .getATEConfigurations()
            .then((config: PBXInterface) => {
              /* eslint-disable */
                  this.$jsSIP.setConfiguration(`wss://${config.server}:${config.port}/ws`, {
                    uri: `sip:${config.login}@${config.server}`,
                    password: config.password,
                    realm: config.server
                  }).on('connected', this.onJsSIPConnected)
                      .on('disconnected', this.onJsSIPDisconnected)
                      .on('registered', this.onJsSIPRegistered)
                      .on('registrationFailed', this.onJsSIPRegistrationFailed)
                      .on('sipEvent', this.onJsSIPSipEvent)
                      .on('newMessage', this.onJsSIPNewMessage)
                      .on('newRTCSession', this.newRTCSession)

                  // Event Disconnected can happen later than Connected
                  setTimeout(() => {
                    this.$jsSIP.start()
                  }, 1000)
                  /* eslint-enable */
            })

          // Глобальные обработчики
          this.$jsSIP.onSessionConnecting = (self: JsSIP, session: RTCSession, event: ConnectingEvent) => {
            // Слушатель событий в рамках одной сессии
            session.on('failed', (event: EndEvent) => {
              this.$toast.error(event.cause)
            })

            this.callMachineService.send({
              type: 'CONNECTION',
              jssip: self,
              session,
              event
            })

            if (this.$isDebug) {
              console.group('JsSIP: Начало сессии')
              console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.log(event)
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.groupEnd()
            }
          }

          this.$jsSIP.onSessionProgress = async (self: JsSIP, session: RTCSession, event: IncomingEvent | OutgoingEvent) => {
            /* eslint-disable */
            // Определяю номер телефона
            let target: string = ''
            if (session.direction === 'incoming') {
              target = session.remote_identity.display_name
            } else {
              target = self.target
            }

            this.callMachineService.send({
              type: 'PROGRESS',
              jssip: self,
              session,
              event
            })

            if (this.$isDebug) {
              console.group('JsSIP: В процессе звонка...')
              console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
              console.log('%c%s', 'color: #ef00ff;', `Номер телефона: ${target}`)
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.log(event)
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.groupEnd()
            }


            if (session.direction === 'incoming') {
              // Достаю номер телефона из базы данных если есть

              self.setPayload<JSSIPPayloadInterface>({
                contact_id: 0,
                target
              })

              new Contacts()
                  .getByPhoneNumber<ContactInterface>(target)
                  .then((response) => {
                    let displayPoneNumber: string = '...'
                    if (this.$libPhoneNumberJs.parsePhoneNumber(target)?.isValid) {
                      const pn = this.$libPhoneNumberJs.parsePhoneNumber(target)
                      displayPoneNumber = String(pn?.formatNational()) // Форматирую номер телефона
                    }

                    // Мы обязаны положить значение в полезную нагрузку, что бы потом воспользоваться далее по жизненному циклу
                    // Реальные данные
                    self.setPayload<JSSIPPayloadInterface>({
                      contact_id: response.id,
                      target
                    })

                    // Обновляю диалоговое окно
                    this.updateRTCToast(session.id, `${response.first_name} ${response.last_name}`, displayPoneNumber)
                  })

              let displayPoneNumber: string = target
              if (this.$libPhoneNumberJs.parsePhoneNumber(target)?.isValid) {
                const pn = this.$libPhoneNumberJs.parsePhoneNumber(target)
                displayPoneNumber = String(pn?.formatNational()) // Форматирую номер телефона
              }

              // Вскрываю диалоговое окно
              this.showRTCToast(displayPoneNumber, displayPoneNumber, session.id)
            }
            /* eslint-enable */
          }

          // Звонок приняли
          this.$jsSIP.onSessionAccepted = (self: JsSIP, session: RTCSession, event: IncomingEvent | OutgoingEvent) => {
            this.callMachineService.send({
              type: 'ACCEPTED',
              jssip: self,
              session,
              event
            })

            if (this.$isDebug) {
              console.group('JsSIP: Принятый')
              console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.log(event)
              console.log(session)
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.groupEnd()
            }
          }

          this.$jsSIP.onSessionEnded = (self: JsSIP, session: RTCSession, event: EndEvent) => {
            /* eslint-disable */
            let audioRecordId
            if (session.direction === 'incoming') {
              audioRecordId = session._request.headers['X-Call-Filename'][0]['raw']
            } else {
              audioRecordId = this.$jsSIP.uuid
            }

            this.callMachineService.send({
              type: 'ENDED',
              jssip: self,
              session,
              event
            })

            this.callMachineService.send({
              type: session.direction,
              jssip: self,
              session,
              event
            })

            this.callMachineService.send({
              type: event.cause,
              jssip: self,
              session,
              event
            })

            if (this.$isDebug) {
              console.group('JsSIP: Завершение сессии')
              console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.log(`X-Call-Filename: ${audioRecordId}`)
              console.log(event)
              console.log(session.direction)
              console.log(session)
              console.log(self.getPayload())
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.groupEnd()
            }

            if (session.direction === 'incoming') {
              this.$toast.dismiss(session.id)
            }

            let historyData = {
              session_start_time: this.$jsSIP.sessionStartTime.getTime() / 1000,
              session_end_time: this.$jsSIP.sessionEndTime.getTime() / 1000,
              start_timestamp: session.start_time ? session.start_time.getTime() / 1000 : null,
              end_timestamp: session.end_time ? session.end_time.getTime() / 1000 : null,
              type: 'call',
              direction: session.direction,
              originator: event.originator,
              cause: event.cause,
              audio_record_id: audioRecordId
            } as HistoryDataInterface

            // Если АТС не вернула время звонка, удаляем ненужные данные из запроса
            if (historyData.start_timestamp == null) {
              delete historyData.start_timestamp  // Время начала разговора не требуется, так как разговор не состоялся.
              delete historyData.end_timestamp    // Время завершения разговора не требуется, так как разговор не состоялся.
              delete historyData.audio_record_id  // ID аудиозаписи не требуется, так как разговор не состоялся.
            }

            if (event.cause === 'Canceled') {
              historyData.direction = session.direction + '_canceled'
            }

            let contactId = 0;

            // Внимание!!!
            // Прежде чем получать значение полезной нагрузки, убедитесь что вы её туда положили
            contactId = self.getPayload<JSSIPPayloadInterface>().contact_id
            historyData.target = self.getPayload<JSSIPPayloadInterface>().target

            // if (session.direction === 'incoming' && event.cause === 'Canceled' && event.originator === 'remote') {
            //   // Входящий, Отменён удалённой стороной
            //   this.$toast.info('Входящий, Отменён удалённой стороной', { timeout: false })
            //   // Сохраняем историю пропущенного звонка
            //   this.addHistory(contactId, historyData)
            // } else if (session.direction === 'incoming' && event.cause === 'Rejected' && event.originator === 'local') {
            //   // Входящий, Отменён нашей стороной
            //   this.addHistory(contactId, historyData)
            // } else if (session.direction === 'incoming' && event.cause === 'Rejected' && event.originator === 'local') {
            //   // Входящий, Отменён нашей стороной
            //   this.addHistory(contactId, historyData)
            // } else if (session.direction === 'outgoing' && event.cause === 'Canceled' && event.originator === 'local') {
            //   // Исходящий, Отменён нашей стороной
            //   this.addHistory(contactId, historyData)
            // } else if (session.direction === 'outgoing' && event.cause === 'Canceled' && event.originator === 'remote') {
            //   this.$toast.info('Исходящий, Отменён удалённой стороной', { timeout: false })
            // } else {
            //
            // }
            this.addHistory<number>(contactId, historyData)
                .then((historyId: number) => {
                  if (this.$store.getters['project/statuses'].length > 0) {
                    // Диалог статуса звонка
                    this.$dialog.show(VStatusEditDialog, {
                      waitForResult: true,
                      statuses: this.$store.getters['project/statuses'], // Статусы в текущем проекте
                      width: ['xs', 'sm'].includes(this.$vuetify.breakpoint.name) ? '100%' : '60%',
                      height: '600',
                      onSave: (data: StatusInterface) => {
                        new Contacts()
                            .updateHistory(historyId, {
                              status_id: data.status.id,
                              comment: data.comment
                            }).finally(() => {
                          this.$root.$emit('root-contact-history-change')
                        })
                      }
                    })
                  } else {
                    this.$toast.warning(this.$tc('The status cannot be set, because the project is configured incorrectly!'))
                  }
                })

            // Добавление данных в историю.
            /* eslint-enable */
          }

          this.$jsSIP.onSessionFailed = (self: JsSIP, session: RTCSession, event: EndEvent) => {
            this.callMachineService.send({
              type: 'FAILED',
              jssip: self,
              session,
              event
            })
          }
        })

      jssipInitialize()
      libphonenumberInitialize()
    },

    onJsSIPConnected (event: ConnectedEvent) {
      if (this.$isDebug) {
        console.group('JsSIP: Соединение установлено.')
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.log(event)
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.groupEnd()
      }
    },

    onJsSIPDisconnected (event: DisconnectEvent) {
      if (this.$isDebug) {
        console.group('JsSIP: Соединение разорвано.')
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.log(event)
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.groupEnd()
      }
    },

    onJsSIPRegistered (event: any) {
      if (this.$isDebug) {
        console.group('JsSIP: Зарегистрирован')
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.log(event)
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.groupEnd()
      }
    },

    onJsSIPRegistrationFailed (event: UnRegisteredEvent) {
      if (this.$isDebug) {
        console.log('%c%s', 'color: red;', 'JsSIP: Ошибка [' + event.cause + ']')
      }

      // Только в интерфейсе оператора выводим информацию об ошибке при подключении
      if (this.$store.getters['profile/role_is_operator']) {
        this.$toast.error({
          component: VToast,
          props: {
            title: this.$tc('Error connecting to PBX'),
            text: this.$t('Cause: {text}', { text: event.cause }),
            actions: [
              {
                attrs: {
                  label: this.$tc('Tune'),
                  style: { color: 'white' }
                },
                on: {
                  click: () => {
                    this.$router.push({ name: 'operator_settings_telephony' })
                  }
                }
              }
            ]
          }
        }, { timeout: false })
      }
    },

    onJsSIPSipEvent (event: any) {
      if (this.$isDebug) {
        console.group()
        console.log('%c%s', 'color: green;', 'JsSIP: Событие')
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.log(event)
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.groupEnd()
      }
    },

    onJsSIPNewMessage (event: any) {
      if (this.$isDebug) {
        console.group('JsSIP: Новое сообщение')
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.log(event)
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.groupEnd()
      }
    },

    showRTCToast (displayName: string, phoneNumber: string, id: string | number) {
      this.RTCToastOptions.id = id
      this.toastId = this.$toast({
        component: IncomingRTCSession,
        props: {
          displayName,
          phoneNumber
        },
        listeners: {
          answer: this.onAnswer,
          hangup: this.onHangup
        }
      }, this.RTCToastOptions)
    },

    updateRTCToast (toastId: string | number, displayName: string, phoneNumber: string) {
      this.$toast.update(toastId, {
        content: {
          component: IncomingRTCSession,
          props: {
            displayName,
            phoneNumber
          },
          listeners: {
            answer: this.onAnswer,
            hangup: this.onHangup
          }
        }
      })
    },

    /**
     * RTC сессия
     * @param event
     */
    newRTCSession (event: IncomingRTCSessionEvent | OutgoingRTCSessionEvent) {
      // event.session.on('progress', (e: IncomingEvent | OutgoingEvent) => {
      //   if (event.session.direction === 'incoming') {
      //     console.log(event.session.remote_identity.display_name)
      //   } else {
      //     console.log(event.session.remote_identity.display_name)
      //   }
      // })
      //
      // event.session.on('accepted', (e: IncomingEvent | OutgoingEvent) => {
      //   // todo: Принятый
      // })
      //
      // event.session.on('ended', (e: EndEvent) => {
      //   // todo: Завершение
      // })
      //
      // event.session.on('failed', (e: EndEvent) => {
      //   // todo: Завершение с ошибкой
      // })
    },

    onAnswer () {
      this.$jsSIP.answer()
    },

    onHangup () {
      this.$toast.dismiss(this.toastId)
      this.$jsSIP.cancel()
    },

    addHistory<T> (contactId: number, historyData: any): T | any {
      return new Promise<T>((resolve) => {
        new Contacts()
          .addHistory(contactId, historyData)
          .then((id: T) => {
            resolve(id)
          }).finally(() => {
            this.$root.$emit('root-contact-history-change')
          })
      })
    }
  }
})
</script>

<style lang="scss">
.background--header {
  background-image: linear-gradient(to bottom, #1b4685, #3d4899, #6446a9, #8d3eb1, #b729b1);
}

.scroll-area {
  position: relative;
  margin: auto;
  width: 600px;
  height: 400px;
}

.transition-fade {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 2s;
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

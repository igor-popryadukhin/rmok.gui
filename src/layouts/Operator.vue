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
        <v-tabs background-color="primary" height="40">
          <v-tab
            v-for="(item, index) in mainMenu"
            :id="`v-toolbar-v-tab-${index}`"
            :key="`v-toolbar-v-tab-${index}`"
            v-bind="item.attrs"
          >
            <template>
              {{ $tc(item.title) }}
            </template>
            <template
              v-if="item.children"
              v-slot:default
            >
              {{ $tc(item.title) }}
              <v-menu
                :activator="`#v-toolbar-v-tab-${index}`"
                offset-y
              >
                <v-list>
                  <v-list-item
                    v-for="(childrenItem, childIndex) in item.children"
                    :key="childIndex"
                    v-bind="childrenItem.attrs"
                    v-on="childrenItem.on"
                  >
                    <v-list-item-title>{{ $tc(childrenItem.title) }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <template
              v-if="item.badge"
            >
              <v-badge
                v-if="typeof item.badge === 'function' ? item.badge().visible : item.badge.visible"
                v-bind="typeof item.badge === 'function' ? item.badge().attrs : item.badge.attrs"
              />
            </template>
          </v-tab>
        </v-tabs>
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
        <v-card
          v-if="notifications.length > 0"
          class="overflow-y-auto"
          max-width="600"
          max-height="500"
          flat
          tile
        >
          <v-card-text>
            <v-list dense>
              <template v-for="(item, itemIndex) in notifications">
                <v-list-item
                  :key="itemIndex"
                  v-on:click="item.click ? item.click(item, itemIndex): null"
                  :class="item.class || ''"
                  :style="item.style || {}"
                  link
                >
                  <v-list-item-avatar>
                    <v-icon :color="item.color">
                      {{ item.icon }}
                    </v-icon>
                  </v-list-item-avatar>

                  <v-tooltip
                    color="primary"
                    max-width="500"
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item-content
                        v-on="on"
                        v-bind="attrs"
                      >
                        <v-list-item-title v-html="item.title" />
                        <v-list-item-subtitle v-html="item.message" />
                        <v-list-item-subtitle v-if="item.message2" v-html="item.message2" />
                      </v-list-item-content>
                    </template>
                    <template v-if="item.message">
                      <span class="mb-3" v-html="item.message"></span><br />
                    </template>
                    <template v-if="item.message2">
                      <span>{{ item.message2 }}</span>
                    </template>

                  </v-tooltip>

                  <v-list-item-action v-if="item.actions">
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
                      <v-list class="pa-0" min-width="150">
                        <v-list-item
                          v-for="(action, actionIndex) in item.actions"
                          :key="actionIndex"
                          link
                          @click="action.handle(action.context)"
                          @mouseup.stop="buttonMenuNotification = false"
                        >
                          <v-list-item-content>
                            <v-list-item-title>{{ action.title }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
                <v-divider :key="`v-divider-${itemIndex}`" inset/>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-menu>

      <v-divider class="mr-2 ml-2" inset vertical/>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ml-2 mr-2"
            v-on="on"
            v-bind="attrs"
            :loading="statusSetProcess"
            icon
            small
          >
            <v-icon
              v-if="$store.getters['profile/status'] === 'available'"
            >
              mdi-check-circle-outline
            </v-icon>
            <v-icon
              v-if="$store.getters['profile/status'] === 'do_not_disturb'"
            >
              mdi-do-not-disturb
            </v-icon>
            <v-icon
              v-if="$store.getters['profile/status'] === 'coffee_break'"
            >
              mdi-pause-circle-outline
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $tc('Current status') }}</span>
      </v-tooltip>

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
              class="avatar"
              item
            >
              {{ avatar }}
            </v-avatar>
          </v-btn>
        </template>
        <v-list
          class="pl-0 pr-0"
          tile
        >
          <template
            v-for="(accountMenuItem, accountMenuItemIndex) in accountMenuItems"
          >
            <v-divider v-if="accountMenuItem.divider" :key="accountMenuItemIndex"/>
            <v-subheader
              v-else-if="accountMenuItem.subheader"
              :key="accountMenuItemIndex"
              v-bind="accountMenuItem"
            >{{ accountMenuItem.title }}
            </v-subheader>
            <v-list-item
              v-else
              :key="accountMenuItemIndex"
              v-bind="accountMenuItem.attrs"
              v-on="accountMenuItem.on"
            >
              <v-list-item-icon>
                <v-icon v-bind="accountMenuItem.icon.attrs">{{ accountMenuItem.icon.name }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $tc(accountMenuItem.title) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
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
        fluid
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
import Vue, { VueConstructor } from 'vue'
import breadcrumbs from '@/mixins/breadcrumbs'
import { MainSearchInterface, NotificationInterface } from '@/Interfaces'
import { debounce } from 'vuetify/src/util/helpers'
import Tasks, { TaskInterface, TaskType } from '@/api/Tasks'
import Projects, { ProjectInterface } from '@/api/Projects'
import Users from '@/api/Users'
import { Configurations } from '@/api/Configurations'
import PBXInterface from '@/api/Schemas/PBXInterface'
import { ConnectingEvent, EndEvent, IncomingEvent, OutgoingEvent, RTCSession } from 'jssip/lib/RTCSession'
import { Contacts } from '@/api/Contacts'
import { UnRegisteredEvent } from 'jssip/lib/UA'
import VToast from '@/components/VToast/VToast.vue'
import IncomingRTCSession from '@/components/IncomingRTCSession/IncomingRTCSession.vue'
import { ToastOptions } from 'vue-toastification/dist/types/src/types'
import { POSITION } from 'vue-toastification'
import { JsSIP } from '@/jsSIP/plugin'
import callMachine from '@/xState/machines/callMachine'
import { mapGetters } from 'vuex'
import { interpret } from 'xstate'
import Account, { UserStatus } from '@/api/Account'
import VInterface from '@/VInterface'

interface IProps {
  source: string;
}

interface IData {
  toastId: number | string;
  projectDialog: any;
  buttonMenuNotification: any;
  mainSearch: any;
  settings: any;
  dialog: any;
  drawer: any;
  accountMenuItems: any;
  notifications: NotificationInterface[];
  projects: any;
  RTCToastOptions: ToastOptions,
  callMachineService: any
  current: any
  context: any
  statusSetProcess: boolean
}

interface IMethod {
  onRootNewTasks: () => void;
  jsSIPSetConfiguration: () => void;
  onRootLoadingProjects: () => void;
  onRootTasksFetchCount: () => void;
  onProjectItemClick: (item: ProjectInterface & { loading: boolean }) => void;
  showRTCToast: (data: any) => void;
  updateRTCToast: (data: any) => void;
  onAnswer: () => void;
  onHangup: () => void;
  addHistory: <T>(contactId: number, historyData: any) => Promise<T>;
}

interface IComputed {
  avatar: string;
  mainMenu: any[];
  projectDialogWidth: string;
}

export default (Vue as VueConstructor<VInterface>).extend<IData, IMethod, IComputed, IProps>({
  props: {
    source: String
  },

  mixins: [breadcrumbs],

  data (): IData {
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
      accountMenuItems: [
        {
          title: 'Available',
          icon: {
            name: 'mdi-check-circle-outline',
            attrs: {
              color: 'green'
            }
          },
          attrs: {
            dense: true,
            link: true
          },
          on: {
            click: () => {
              (this as any).statusSetProcess = true
              new Account()
                .setStatus(UserStatus.AVAILABLE)
                .finally(() => {
                  this.$store
                    .dispatch('profile/loadProfile')
                    .finally(() => ((this as any).statusSetProcess = false))
                })
            }
          }
        },
        {
          title: 'Do not disturb',
          icon: {
            name: 'mdi-do-not-disturb',
            attrs: {
              color: 'red'
            }
          },
          attrs: {
            dense: true,
            link: true
          },
          on: {
            click: () => {
              (this as any).statusSetProcess = true
              new Account()
                .setStatus(UserStatus.DO_NOT_DISTURB)
                .finally(() => {
                  this.$store
                    .dispatch('profile/loadProfile')
                    .finally(() => ((this as any).statusSetProcess = false))
                })
            }
          }
        },
        {
          title: 'Break',
          icon: {
            name: 'mdi-pause-circle-outline',
            attrs: {
              color: 'blue'
            }
          },
          attrs: {
            link: true,
            dense: true
          },
          on: {
            click: () => {
              (this as any).statusSetProcess = true
              new Account()
                .setStatus(UserStatus.COFFEE_BREAK)
                .finally(() => {
                  this.$store
                    .dispatch('profile/loadProfile')
                    .finally(() => ((this as any).statusSetProcess = false))
                })
            }
          }
        },

        { divider: true },

        {
          title: 'Profile',
          icon: {
            name: 'mdi-account',
            attrs: {}
          },
          attrs: {
            dense: true,
            to: {
              name: 'operator_settings_profile'
            }
          }
        },
        {
          title: 'Exit',
          icon: {
            name: 'mdi-exit-run',
            attrs: {}
          },
          attrs: {
            dense: true
          },
          on: {
            click: () => this.$router.replace({ name: 'login' })
          }
        }
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
      context: callMachine.context,
      statusSetProcess: false
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
    }
  },

  computed: {
    ...mapGetters({
      task_pending_count: 'tasks/pending_count'
    }),

    avatar () {
      const first: string = this.$store.getters['profile/first_name'] || ''
      const last: string = this.$store.getters['profile/last_name'] || ''
      return first.charAt(0) + last.charAt(0)
    },

    mainMenu () {
      return [
        {
          title: this.$tc('Leads'),
          attrs: {
            value: this.$tc('Leads'),
            text: true,
            to: { name: 'operator_leads' }
          }
        },
        {
          title: this.$tc('Contacts'),
          attrs: {
            text: true,
            to: { name: 'operator_contacts_list' }
          }
        },
        {
          title: this.$tc('Tasks'),
          icon: '',
          badge: () => { // Может быть как функция возвращающая объект, так и обычный объект
            let visible = false
            const attrs: any = {
              content: this.task_pending_count,
              inline: true,
              color: 'red'
            }

            if (this.task_pending_count > 0) {
              visible = true
            }

            return {
              visible,
              attrs
            }
          },
          attrs: {
            link: true,
            disabled: false,
            to: { name: 'operator_tasks_list' }
          }
        },
        {
          title: 'Statistic',
          icon: 'mdi-chart-arc',
          attrs: {
            link: true
          },
          children: [
            {
              title: 'Recent call statistics',
              icon: '',
              visible: true,
              attrs: {
                to: {
                  name: 'operator_reports_recent_calls'
                }
              }
            },
            {
              title: 'Statistics for all calls',
              icon: '',
              visible: true,
              attrs: {
                to: {
                  name: 'operator_reports_all_calls'
                }
              }
            }
          ]
        }
        // {
        //   title: this.$tc('Help'),
        //   attrs: {
        //     text: true,
        //     disabled: true,
        //     to: { name: 'operator_help' }
        //   }
        // }
      ]
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
    this.$root.$on('show-rtc-toast', this.showRTCToast)
    this.$root.$on('update-rtc-toast', this.updateRTCToast)

    // TODO: TASKS FETCH DATA

    // Инициализация телефонии
    this.$root.$on('root-jssip-set-configuration', this.jsSIPSetConfiguration)

    // Событие загрузки проектов для выбора
    this.$root.$on('root-loading-projects', this.onRootLoadingProjects)

    this.callMachineService = interpret(callMachine.withContext(this))
    this.callMachineService
      .onTransition((state: any) => {
        this.current = state
        this.context = state.context
      }).start()

    this.$root.$emit('root-jssip-set-configuration')

    this.$store.subscribe(
      ({ payload, type }) => {
        if (type === 'profile/setStatus') {
          if ([UserStatus.AVAILABLE, UserStatus.DO_NOT_DISTURB].includes(payload)) {
            if (!this.$jsSIP.isConnected) {
              this.$jsSIP.start()
            }
          } else {
            if (this.$jsSIP.isConnected) {
              this.$jsSIP.stop()
            }
          }
        }
      }
    )

    // Notification.requestPermission(function (permission) {
    //   console.log('Результат запроса прав:', permission)
    //   setInterval(() => {
    //     const notification = new Notification('Sex', {
    //       body: '<div style="background-color: #9C27B0">SEX</div>',
    //       dir: 'auto'
    //     })
    //
    //     notification.onclick = () => {
    //       console.log('Вы кликнули!')
    //     }
    //   }, 3000)
    // })
  },

  created () {
    this.$store.dispatch('tasks/pending_count')
    this.$store.subscribe(
      ({ payload, type }) => {
        if (type === 'project/set') {
          if (payload.statuses) {
            if (payload.statuses.length === 0) {
              // TODO: TASKS FETCH DATA
            }
          }
        }
      }
    )

    setTimeout(() => {
      // TODO: TASKS FETCH DATA
      this.$store.dispatch('tasks/pending_count')
    }, 1000)
  },

  beforeDestroy () {
    this.$root.$off('show-rtc-toast', this.showRTCToast)
    this.$root.$off('update-rtc-toast', this.updateRTCToast)
    this.$root.$off('root-loading-projects', this.onRootLoadingProjects)
    this.$root.$off('root-jssip-set-configuration', this.jsSIPSetConfiguration)
  },

  methods: {
    onRootNewTasks () {
      new Tasks()
        .find()
        .then((response) => {
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

          // Проверяем наличие подключения и текущего статуса
          response.data.forEach((task: unknown & TaskInterface) => {
            if (task.state === 'pending') {
              let title = ''
              let icon = ''
              switch (task.type) {
                case TaskType.CALL: {
                  title = `Позвонить ${this.$moment.unix(task.planned_for).format('Do MMMM, dddd, hh:mm:ss a')}`
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
                let class_ = ''

                if (task.expired) {
                  class_ = 'task-expired'
                }

                let message = `${task.contact?.first_name} ${task.contact?.last_name} ${task.contact?.middle_name}`
                if (this.assertObjectHasAttribute(task.contact, 'last_status')) {
                  if (task.contact.last_status) {
                    message = `${message} <strong>(Статус: ${task.contact.last_status.name})</strong>`
                  }
                }

                this.notifications.push({
                  type: 'call',
                  icon,
                  color: 'blue',
                  class: class_,
                  title,
                  message,
                  message2: task.description,
                  context: task, // Обрати внимание, context будет передан в функцию обратного вызова click
                  click: (e: NotificationInterface, i: number) => {
                    if (this.assertObjectHasAttribute(e.context, 'contact')) {
                      if (this.assertObjectHasAttribute(e.context?.contact, 'id')) {
                        this.$router.replace({
                          name: 'operator_contacts_view_tasks',
                          params: { contact_id: e.context?.contact.id },
                          query: { task_id: e.context?.id }
                        })
                      }
                    } else {
                      console.error('Задача для контакта не содержит данные контакта')
                    }
                  }
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
                      context: task,
                      handle: (arg: TaskInterface) => {
                        new Tasks()
                          .setState(arg.id)
                          .then(() => {
                            // TODO: TASKS FETCH DATA
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

          this.$root.$emit('root-load-leads')
          this.$root.$emit('root-load-tasks')
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
          })

          // Показать диалог выбора проекта, если таковые имеются
          if (this.projectDialog.projects.length > 0) {
            this.projectDialog.visible = true
          }
        })
    },

    // Телефония
    jsSIPSetConfiguration () {
      if (this.$isDebug) {
        console.log('%c%s', 'color: blue;', 'Инициализация RTC')
      }

      // Инициализация JSSIP
      new Configurations()
        .getATEConfigurations()
        .then((config: PBXInterface) => {
          // Проверяю наличие данных, сервер может вернуть пустые свойства
          if (config.server === '' || (config.login === '' && config.password === '')) {
            return this.$toast.error({
              component: VToast,
              props: {
                title: this.$tc('Error connecting to PBX'),
                text: this.$t('Cause: {text}', { text: 'Нет параметров!' }),
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

          // Отключаемся,если подключены
          if (this.$jsSIP.isConnected) {
            this.$jsSIP.stop()
          }

          setTimeout(() => {
            this.$jsSIP.setConfiguration(`wss://${config.server}:${config.port}/ws`, {
              uri: `sip:${config.login}@${config.server}`,
              password: config.password,
              realm: config.server
            })

            // Глобальные обработчики
            this.$jsSIP.onSessionConnecting = (self: JsSIP, session: RTCSession, event: ConnectingEvent) => {
              this.callMachineService.send({
                type: 'CONNECTING',
                jssip: self,
                session,
                event
              })
            }

            this.$jsSIP.onSessionProgress = async (self: JsSIP, session: RTCSession, event: IncomingEvent | OutgoingEvent) => {
              this.callMachineService.send({
                type: 'PROGRESS',
                jssip: self,
                session,
                event
              })
              /* eslint-enable */
            }

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
              this.callMachineService.send({
                type: 'ENDED',
                jssip: self,
                session,
                event
              })

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

            this.$jsSIP.on('registrationFailed', (event: UnRegisteredEvent) => {
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
            })

            if ([UserStatus.AVAILABLE, UserStatus.DO_NOT_DISTURB].includes(this.$store.getters['profile/status'])) {
              this.$jsSIP.start()
            }
          }, 1000)

          setTimeout(() => {
            const guid = '6f4de608-5e14-4a77-8922-0d2c68d59161'
            if (!this.$jsSIP.isConnected && [UserStatus.AVAILABLE, UserStatus.DO_NOT_DISTURB].includes(this.$store.getters['profile/status'])) {
              this.notifications.push({
                id: guid,
                type: 'event',
                icon: 'mdi-alert',
                color: 'red',
                title: 'Ошибка',
                message: 'Требуется настроить RTC',
                actions: [
                  {
                    title: 'Настроить',
                    context: null,
                    handle: () => {
                      this.$router.push({ name: 'operator_settings_telephony' })
                    }
                  }
                ]
              })
            } else {
              this.notifications = this.notifications.filter((value: NotificationInterface) => {
                return value.id !== guid
              })
            }
          }, 5000)
        })
    },

    showRTCToast ({ id, data }) {
      this.RTCToastOptions.id = id
      this.toastId = this.$toast({
        component: IncomingRTCSession,
        props: {
          displayName: data.displayName,
          phoneNumber: data.displayName
        },
        listeners: {
          answer: this.onAnswer,
          hangup: this.onHangup
        }
      }, this.RTCToastOptions)
    },

    updateRTCToast ({ id, data }) {
      this.$toast.update(id, {
        content: {
          component: IncomingRTCSession,
          props: {
            displayName: data.displayName,
            phoneNumber: data.phoneNumber
          },
          listeners: {
            answer: this.onAnswer,
            hangup: this.onHangup
          }
        }
      })
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
  background-image: linear-gradient(to bottom, #2967d4, #3a70d4, #3a70d4, #3a70d4, #3a70d4, #3a70d4, #3a70d4);
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

.task-expired > * {
  color: red;
}
</style>

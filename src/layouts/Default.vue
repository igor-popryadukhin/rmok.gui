<template>
  <v-app
    id="inspire"
  >
    <!-- Nav drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="navigation_drawer_mini"
      class="background--drawer"
      permanent
      app
      dark
    >
      <v-list-item class="px-2 pth-63">
        <v-list-item-avatar
          class="v-icon--link"
          color="white"
        >
          <v-btn
            icon
            link
            color="primary"
            @click.stop="navigation_drawer_mini = !navigation_drawer_mini"
          >
            R
          </v-btn>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>RMOK</v-list-item-title>
          <v-list-item-subtitle>{{ $profile.role.name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list dense>
        <template
          v-for="(mainMenuItem, mainMenuIndex) in mainMenu"
        >
          <v-list-group
            v-if="mainMenuItem.children && mainMenuItem.visible"
            :key="mainMenuIndex"
            v-model="mainMenuItem.active"
            no-action
            color="white"
          >
            <template #activator>
              <v-list-item-icon>
                <v-icon v-text="mainMenuItem.icon" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $tc(mainMenuItem.title) }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <template v-for="(mainMenuItemChildren, mainMenuItemChildrenIndex) in mainMenuItem.children">
              <v-list-item
                v-if="mainMenuItemChildren.visible"
                v-bind="mainMenuItemChildren.attrs"
                :key="`child-${mainMenuItemChildrenIndex}`"
                link
                v-on="mainMenuItemChildren.on"
              >
                <v-tooltip
                  open-delay="500"
                  color="primary"
                  right
                  nudge-right="8"
                >
                  <template #activator="{ on, attrs }">
                    <v-list-item-title
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ $tc(mainMenuItemChildren.title) }}
                    </v-list-item-title>
                  </template>
                  <span>{{ $tc(mainMenuItemChildren.title) }}</span>
                </v-tooltip>
                <v-list-item-icon>
                  <v-icon v-text="mainMenuItemChildren.icon" />
                </v-list-item-icon>
              </v-list-item>
            </template>
          </v-list-group>

          <v-divider
            v-else-if="mainMenuItem.divider"
            :key="mainMenuIndex"
          />

          <v-list-item
            v-else-if="mainMenuItem.visible"
            :key="`main-menu-list-item-${mainMenuIndex}`"
            v-bind="mainMenuItem.list_item"
            link
          >
            <v-tooltip
              open-delay="500"
              color="primary"
              right
              nudge-right="8"
            >
              <template #activator="{ on, attrs }">
                <v-list-item-icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    {{ mainMenuItem.icon }}
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ $tc(mainMenuItem.title) }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <span>{{ $tc(mainMenuItem.title) }}</span>
            </v-tooltip>

            <v-list-item-action>
              <template v-if="mainMenuItem.badge">
                <v-badge
                  v-show="mainMenuItem.badge.visible"
                  v-bind="mainMenuItem.badge"
                  inline
                />
              </template>
              <v-list-item-action-text
                v-if="mainMenuItem.new"
                style="color: #ffeb3b"
              >
                NEW
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- App bar -->
    <v-app-bar
      elevation="0"
      :height="$headerHeight"
      class="background--header"
      app
      dark
    >
      <v-app-bar-nav-icon
        class="mr-2"
        @click.stop="navigation_drawer_mini = !navigation_drawer_mini"
      />
      <!--      <v-toolbar-title class="d-inline-block toolbar-title mr-md-5 mr-lg-5">-->
      <!--        <div class="hidden-sm-and-down">RMOK</div>-->
      <!--        <div class="hidden-sm-and-down toolbar-title-subtitle text-lowercase">{{ $profile.role.name }}</div>-->
      <!--      </v-toolbar-title>-->

      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        :label="$t('Search')"
        class="mr-4"
        style="max-width: 400px"
        height="40"
        dense
      />

      <v-spacer />
      <!-- Bell -->

      <v-menu
        :close-on-content-click="false"
        nudge-left="150"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            :disabled="systemNotifications.length === 0"
            class="mr-1 ml-1"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon :class="notificationShakeProcess ? 'notification-shake' : ''">
              mdi-bell
            </v-icon>
            <v-badge
              v-if="systemNotificationsCount > 0"
              color="red"
              :content="systemNotificationsCount > 99 ? '99+' : systemNotificationsCount"
            />
          </v-btn>
        </template>
        <v-card
          v-if="systemNotifications.length > 0"
          class="overflow-y-auto"
          max-width="800"
          min-width="450"
          max-height="500"
          flat
          tile
        >
          <v-card-text>
            <v-list>
              <template v-for="(item, itemIndex) in systemNotifications">
                <v-list-item
                  :key="itemIndex"
                  link
                >
                  <v-list-item-icon v-if="item.priority ==='normal'">
                    <v-icon color="primary">
                      mdi-information-outline
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-list-item-title v-on="on">
                          {{ item.message }}
                        </v-list-item-title>
                      </template>
                      <span>
                        {{ item.message }}
                      </span>
                    </v-tooltip>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      text
                      small
                      tile
                      @click="onBtnCloseNotification(item.id)"
                    >
                      {{ $tc('Close') }}
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider
                  :key="`v-divider-${itemIndex}`"
                />
              </template>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn
              tile
              block
              text
              small
              @click="onSystemNotificationCloseAllClick"
            >
              {{ $tc('Close all') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

      <div
        class="d-lg-block d-md-block d-sm-none d-xs-none"
        style="width: 20px"
      />

      <v-menu
        offset-y
        min-width="300"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            large
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
            <v-divider
              v-if="accountMenuItem.divider"
              :key="accountMenuItemIndex"
            />
            <v-subheader
              v-else-if="accountMenuItem.subheader"
              :key="accountMenuItemIndex"
              v-bind="accountMenuItem"
            >
              {{ accountMenuItem.title }}
            </v-subheader>
            <v-list-item
              v-else
              :key="accountMenuItemIndex"
              v-bind="accountMenuItem.attrs"
              v-on="accountMenuItem.on"
            >
              <v-list-item-icon>
                <v-icon v-bind="accountMenuItem.icon.attrs">
                  {{ accountMenuItem.icon.name }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $tc(accountMenuItem.title) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Calls } from '@/api/Calls'
import { Contacts } from '@/api/Contacts'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import SipErrors from '@/api/SipErrors'
import Tasks from '@/api/Tasks'
import VToast from '@/components/VToast/VToast.vue'
import JSSIPPayloadInterface from '@/interfaces/JSSIPPayloadInterface'
import SSEMessage from '@/interfaces/SSEMessage'
import { JsSIP } from '@/jsSIP/plugin'
import { ProfileState } from '@/store/profile/state'
import { ConnectingEvent, EndEvent, IncomingEvent, OutgoingEvent, RTCSession } from 'jssip/lib/RTCSession'
import { UnRegisteredEvent } from 'jssip/lib/UA'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Notifications from '@/api/Notifications'

interface Data {
  [key: string]: any;
}

interface Methods {
  [key: string]: any;
}

interface Computed {
  [key: string]: any;
}

interface Props {
  [key: string]: any;
}

export default Vue.extend<Data, Methods, Computed, Props>({
  data (): Data {
    return {
      accountMenuItems: [
        {
          attrs: {
            dense: true,
            to: {
              name: 'settings_profile'
            }
          },
          icon: {
            attrs: {},
            name: 'mdi-account'
          },
          title: 'Profile'
        },
        {
          attrs: {
            dense: true
          },
          icon: {
            attrs: {},
            name: 'mdi-exit-run'
          },
          on: {
            click: () => this.$router.replace({ name: 'login' })
          },
          title: 'Exit'
        }
      ],
      dialog: false,
      drawer: true,
      mini: false,
      settings: {
        suppressScrollX: false,
        suppressScrollY: false,
        wheelPropagation: false
      },
      notificationShakeProcess: false
    }
  },

  computed: {
    ...mapGetters({
      pcConfig: 'settings/pc_config',
      tasksPendingCount: 'tasks/pending_count',
      systemNotifications: 'system/notifications',
      systemNotificationsCount: 'system/notifications_count'
    }),

    profile (): ProfileState {
      return this.$store.getters['profile/profile']
    },

    avatar () {
      const first: string = this.profile.first_name || 'N'
      const last: string = this.profile.last_name || 'N'
      return first.charAt(0) + last.charAt(0)
    },

    mainMenu () {
      return [
        {
          title: 'Новые',
          icon: 'mdi-phone-dial',
          list_item: {
            to: {
              name: 'leads'
            }
          },
          badge: {
            content: 0,
            visible: false,
            color: '#ff5722'
          },
          visible: this.$isGranted('SECTION_CONTACTS_NEW')
        },
        {
          title: 'Очередь',
          icon: 'mdi-human-queue',
          list_item: {
            to: {
              name: 'queue_leads'
            }
          },
          new: true,
          visible: [17, 87, 79, 19].includes(this.$profile.id)
        },
        {
          title: 'Tasks',
          icon: 'mdi-book-check',
          list_item: {
            to: {
              name: 'tasks'
            }
          },
          badge: {
            content: this.tasksPendingCount > 99 ? '99+' : this.tasksPendingCount,
            visible: this.tasksPendingCount > 0,
            color: '#ff5722'
          },
          visible: this.$isGranted('SECTION_TASKS')
        },
        {
          title: 'Contacts',
          icon: 'mdi-contacts',
          list_item: {
            to: {
              name: 'contacts'
            }
          },
          visible: this.$isGranted('SECTION_CONTACTS')
        },
        {
          title: 'Roles',
          icon: 'mdi-puzzle',
          list_item: {
            to: {
              name: 'roles'
            }
          },
          visible: this.$isGranted('EDIT_ROLE')
        },
        {
          title: 'Groups',
          icon: 'mdi-account-group',
          list_item: {
            to: {
              name: 'groups_list'
            }
          },
          visible: this.$isGranted('SECTION_GROUPS')
        },
        {
          title: 'Users',
          icon: 'mdi-account-multiple-outline',
          list_item: {
            to: {
              name: 'users_list'
            }
          },
          visible: this.$isGranted(['USER_CREATE', 'USER_EDIT', 'USER_DELETE'])
        },
        {
          title: 'Projects',
          icon: 'mdi-projector-screen',
          list_item: {
            to: {
              name: 'projects_list'
            }
          },
          visible: this.$isGranted('SECTION_PROJECTS')
        },
        {
          title: 'Statistic',
          active: false,
          children: [
            {
              attrs: {
                to: {
                  name: 'statistics_recent_calls'
                }
              },
              icon: '',
              title: 'Last call statistics',
              visible: this.$isGranted('STATISTICS_RECENT_CALLS')
            },
            {
              attrs: {
                to: {
                  name: 'statistics_all_calls'
                }
              },
              icon: '',
              title: 'Statistics for all calls',
              visible: this.$isGranted('STATISTICS_ALL_CALLS')
            },
            {
              attrs: {
                to: {
                  name: 'statistics_call_count'
                }
              },
              icon: '',
              title: 'By the number of calls',
              visible: this.$isGranted('STATISTICS_CALL_COUNT')
            },
            {
              attrs: {
                to: {
                  name: 'statistics_activity'
                }
              },
              icon: '',
              title: 'Employment of employees',
              visible: this.$isGranted('STATISTICS_ACTIVITY')
            },
            {
              attrs: {
                to: {
                  name: 'statistics_unauthorized_breaks'
                }
              },
              icon: '',
              title: 'Unauthorized breaks',
              visible: this.$isGranted('STATISTICS_UNAUTHORIZED_BREAKS')
            }
          ],
          icon: 'mdi-chart-arc',
          list_item: {},
          visible: this.$isGranted([
            'STATISTICS_RECENT_CALLS',
            'STATISTICS_ALL_CALLS',
            'STATISTICS_CALL_COUNT',
            'STATISTICS_ACTIVITY',
            'STATISTICS_UNAUTHORIZED_BREAKS'
          ])
        },
        {
          title: 'Integrations',
          active: false,
          icon: 'mdi-api',
          visible: this.$isGranted('SECTION_INTEGRATIONS'),
          children: [
            {
              title: 'Integration of contacts',
              attrs: {
                to: {
                  name: 'integrations_contacts'
                }
              },
              icon: '',
              visible: true
            },
            {
              title: 'Project Integration Settings',
              attrs: {
                to: {
                  name: 'itegrationset_list'
                }
              },
              icon: 'mdi-arrow-decision-outline',
              visible: true
            }
          ]
        },
        { divider: true },
        {
          active: false,
          children: [
            {
              title: 'Profile',
              attrs: {
                to: {
                  name: 'settings_profile'
                }
              },
              icon: 'mdi-account',
              visible: true
            },
            {
              title: 'Contacts',
              attrs: {
                to: {
                  name: 'settings_contacts'
                }
              },
              icon: 'mdi-contacts',
              visible: true
            },
            {
              title: 'Telephony',
              attrs: {
                to: {
                  name: 'settings_telephony'
                }
              },
              icon: 'mdi-webrtc',
              visible: true
            },
            {
              title: 'Journal',
              attrs: {
                to: {
                  name: 'settings_journal'
                }
              },
              icon: 'mdi-history',
              visible: true
            },
            {
              title: 'Security',
              attrs: {
                to: {
                  name: 'settings_security'
                }
              },
              icon: 'mdi-security',
              visible: true
            },
            {
              title: 'For developer',
              attrs: {
                to: {
                  name: 'settings_for_developer'
                }
              },
              icon: 'mdi-flask',
              visible: this.$isGranted('section.dev_tools')
            },
            {
              title: 'Regional settings',
              attrs: {
                to: {
                  name: 'settings_regional'
                }
              },
              icon: 'mdi-translate',
              visible: true
            },
            {
              title: 'System',
              attrs: {
                to: {
                  name: 'settings_system'
                }
              },
              icon: 'mdi-cog',
              visible: true
            },
            {
              attrs: {},
              on: {
                click: () => {
                  new Calls().communicationQualityDownload()
                }
              },
              title: 'Скачать результаты опроса качества связи',
              visible: true
            }
          ],
          icon: 'mdi-cog-outline',
          title: 'Settings',
          visible: true
        }
      ]
    },

    navigation_drawer_mini: {
      get () {
        return this.$store.getters['settings/navigation_drawer_mini']
      },
      set (value: boolean) {
        this.$store.commit('settings/navigation_drawer_mini', value)
      }
    }
  },

  created () {
    this.$root.$on('sse-profile-changed', this.onSSEProfileChanged)
  },

  mounted () {
    this.$store.dispatch('profile/load')
      .then(() => {
        this.sseInitialize()

        this.jsSIPInitialize()
      })

    // Подписался на действие сохранения новой конфигурации подключения к АТС
    this.$store.subscribeAction(({ type }) => {
      if (type === 'profile/pbx_config/save') {
        this.jsSIPInitialize()
      }
    })

    // Через 5 секунд запрашиваю количество открытых задач
    if (this.$isGranted('SECTION_TASKS')) {
      setTimeout(() => {
        this.$store.dispatch('tasks/pending_count')
        this.$store.dispatch('system/notifications')
      }, 5000)
    }

    // setTimeout(() => {
    //   this.requestAndShowPermission()
    // }, 3000)
  },

  beforeDestroy () {
    this.$root.$off('sse-profile-changed', this.onSSEProfileChanged)
  },

  methods: {
    jsSIPInitialize () {
      const pbxLog = this.$appDebug.extend('PBX')

      let audio_record_id: string | null = null

      const pbx_config = this.$profile.pbx_config
      pbxLog('Инициализация телефонии...')

      if (!pbx_config) {
        pbxLog('Отсутствует конфигурация подключения к АТС')
        return
      }

      pbxLog('Параметры подключения: %o', pbx_config)

      /**
       * Инициализация JSSIP
       * Загружаю данные для авторизации и настройки телефонии.
       */
      // Устанавливаю конфигурацию.
      // Фактически будет создан новый экземпляр this.$jsSIP
      this.$jsSIP.setConfiguration(`wss://${pbx_config.server}:${pbx_config.port}/ws`, {
        password: pbx_config.password,
        realm: pbx_config.server,
        uri: `sip:${pbx_config.login}@${pbx_config.server}`,
        pcConfig: {
          bundlePolicy: this.pcConfig.bundlePolicy,
          certificates: this.pcConfig.certificates,
          iceCandidatePoolSize: this.pcConfig.iceCandidatePoolSize,
          iceServers: this.pcConfig.iceServers,
          iceTransportPolicy: this.pcConfig.iceTransportPolicy,
          rtcpMuxPolicy: this.pcConfig.rtcpMuxPolicy
        }
      })

      // Далее инициализация слушателей
      // Глобальные обработчики
      this.$jsSIP.onSessionConnecting = (self: JsSIP, session: RTCSession, event: ConnectingEvent) => {
        if (event.request.hasHeader('Call-ID')) {
          audio_record_id = event.request.getHeader('Call-ID')
        }
      }

      /**
       * В процессе звонка, мы звоним, нам звонят.
       *
       * @param jssip
       * @param session
       * @param event
       */
      this.$jsSIP.onSessionProgress = async (jssip: JsSIP, session: RTCSession, event: IncomingEvent | OutgoingEvent) => {
        let target = ''
        if (session.direction === 'incoming') {
          target = session.remote_identity.display_name // Извлекаю номер телефона входящего звонка
        } else {
          target = jssip.target // Извлекаю номер телефона исходящего звонка
        }

        // Если входящий, определяем номер телефона
        if (session.direction === 'incoming') {
          new Contacts()
            .getByPhoneNumber<ContactInterface>(target)
            .then((response) => {
              let displayPoneNumber = '...'
              if (this.$libPhoneNumberJs.parsePhoneNumber(target)?.isValid) {
                const pn = this.$libPhoneNumberJs.parsePhoneNumber(target)
                displayPoneNumber = String(pn?.formatNational()) // Форматирую номер телефона
              }

              // Мы обязаны положить значение в полезную нагрузку, что бы потом воспользоваться далее по жизненному циклу
              // Реальные данные
              jssip.setPayload<JSSIPPayloadInterface>({
                contact_id: response.id,
                target
              })

              // Отправляю событие для обновления тоста
              this.$root.$emit('update-rtc-toast', {
                data: {
                  displayName: `${response.first_name} ${response.last_name}`,
                  phoneNumber: displayPoneNumber
                },
                id: session.id
              })
            })

          let displayPoneNumber: string = target
          if (this.$libPhoneNumberJs.parsePhoneNumber(target)?.isValid) {
            const pn = this.$libPhoneNumberJs.parsePhoneNumber(target)
            displayPoneNumber = String(pn?.formatNational()) // Форматирую номер телефона
          }

          this.$root.$emit('show-rtc-toast', {
            data: {
              displayName: displayPoneNumber, // Мы ещё не знаем кто, поэтому отображаем номер телефона
              phoneNumber: displayPoneNumber
            },
            id: session.id
          })
        }

        if (this.$isDebug) {
          console.group('JsSIP: В процессе звонка...')
          console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
          console.log('%c%s', 'color: #ef00ff;', `Номер телефона: ${target}`)
          console.log('%c%s', 'color: green;', '----------------------------------------------------')
          console.log(event)
          console.log('%c%s', 'color: green;', '----------------------------------------------------')
          console.groupEnd()
        }
      }

      /**
       * Звонок принят.
       *
       * @param self
       * @param session
       * @param event
       */
      this.$jsSIP.onSessionAccepted = (self: JsSIP, session: RTCSession, event: IncomingEvent | OutgoingEvent) => {
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

      /**
       * Произошла ошибка.
       *
       * @param self
       * @param session
       * @param event
       */
      this.$jsSIP.onSessionFailed = (self: JsSIP, session: RTCSession, event: EndEvent) => {
        // JsSIP.IncomingRequest or JsSIP.IncomingResponse instance generating the call failure when originator value is ‘remote’, null otherwise.
        if (this.$isDebug && event.message) {
          console.log(event.message)
        }

        if (event.originator === 'local') {
          // Локальный
          if (event.cause === 'Canceled') {
            this.$toast.info('Call canceled')
          }
        } else if (event.originator === 'remote') {
          // Удалённый

          const message = event.message
          if (typeof message === 'object' && 'status_code' in message) {
            if (message?.status_code === 480) {
              /**
               * Q.850 описание: No answer from the user
               * SIP описание: Temporarily unavailable
               */
              if (/Q\.850;cause=19/.test(String((message as any)?.data || ''))) {
                this.$toast.info('Subscriber unavailable')
              } else {
                this.$toast.error((message as any)?.data)
              }
            } else if (message?.status_code === 486) {
              /**
               * Абонент занят.
               * ----------------------------
               * Q.850 описание: User busy
               * SIP описание: Busy here
               */
              if (/Q\.850;cause=17/.test(String((message as any)?.data || ''))) {
                this.$toast.info('The subscriber is busy')
              } else {
                this.$toast.error((message as any)?.data)
              }
            } else if (message?.status_code === 503) {
              /**
               * Отсутствует доступный канал.
               * Эта причина указывает на то, что в настоящее время нет подходящего канала для обработки вызова.
               * ------------------------------------------------------------------------
               * Q.850 описание: No circuit, channel unavailable
               * SIP описание: Service unavailable
               */
              if (/Q\.850;cause=34/.test(String((message as any)?.data || ''))) {
                this.$toast.info('Service unavailable')
              } else {
                this.$toast.error((message as any)?.data)
              }
              /**
               * Ошибка SIP 603 обычно возвращается в качестве ответа,
               * когда с вызываемой стороной был успешно установлен контакт,
               * но она не может или не желает участвовать. Это сообщение об
               * ошибке отправляется вашим сервером VoIP, и Zoiper просто отображает его.
               */
            } else if (message?.status_code === 603) {
              this.$toast.info('Subscriber does not exist')
            } else {
              this.$toast.error((message as any)?.data)
            }
          }
        }

        // Отправка логов c ошибками SIP на сервер
        if (event) {
          try {
            new SipErrors().addLog({
              message: event.cause,
              context: JSON.stringify(event)
            }).then()
          } catch (e) {
            console.error(e)
          }
        }
      }

      /**
       * Ошибка регистрации
       */
      this.$jsSIP.on('registrationFailed', (event: UnRegisteredEvent) => {
        this.$toast.error({
          component: VToast,
          props: {
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
            ],
            text: this.$t('Cause: {text}', { text: event.cause }),
            title: this.$tc('Error connecting to PBX')
          }
        }, { timeout: false })
      })

      // Запуск WEBRTC
      // Запуск если у пользователя установлен статус "Доступен"
      // UserStatus.AVAILABLE       Доступен. Полное отключение от астериска.
      // UserStatus.DO_NOT_DISTURB  Не беспокоить, но можно звонить.
      // if ([UserStatus.AVAILABLE, UserStatus.DO_NOT_DISTURB].includes(this.$store.getters['profile/status'])) {
      //   this.$jsSIP.start()
      // }
      this.$jsSIP.start()
    },

    sseInitialize () {
      if ('VUE_APP_SSE' in process.env) {
        const url = new URL('/.well-known/mercure', process.env.VUE_APP_SSE)

        // Темы для подписок
        url.searchParams.append('topic', `${window.origin}/users/${this.$profile.id}/event`)
        // url.searchParams.append('topic', 'my-topic1')
        // url.searchParams.append('topic', 'my-topic2')

        const eventSource = new EventSource(url, {
          withCredentials: true
        })

        eventSource.addEventListener('event', (event: Event) => {
          if (event instanceof MessageEvent) {
            const obj: SSEMessage = JSON.parse(event.data)

            // Кидаем сообщение на корневую шину
            this.$root.$emit('sse-' + obj.name, obj.data)

            // Что-то изменилось в задачах
            if (obj.name === 'tasks-changed') {
              if (this.$isGranted('SECTION_TASKS')) {
                this.$store.dispatch('tasks/pending_count')
              }
            } else if (obj.name === 'system-notification') {
              // Звук уведомления только если в режиме ожидания.
              this.$store.dispatch('system/notifications')
                .then(() => {
                  if (this.$jsSIP.state === 'idle') {
                    this.$sound.play('/sounds/notifications/1.mp3')
                    this.notificationShake()
                  // TODO: Скоро уведомления в мозг.
                  // this.showNotification('Новое системное уведомление!')
                  }
                })
            }
          }
        })

        // SSE типа message
        eventSource.onmessage = (event) => {
          // Emit в корневой экземпляр
          this.$root.$emit('root-sse-message', event.data)
        }
      }
    },

    showNotification (title: string, body: string) {
      if (document.visibilityState === 'visible') {
        return
      }
      const icon = 'image-url'
      const notification = new Notification(title, { body, icon })
      notification.onclick = () => {
        notification.close()
        window.parent.focus()
      }
    },

    notificationShake () {
      this.notificationShakeProcess = true
      setTimeout(() => {
        this.notificationShakeProcess = false
      }, 800)
    },

    requestAndShowPermission () {
      Notification.requestPermission((permission) => {
        if (permission === 'denied') {
          this.$toast.info('Что бы получать системные уведомления, требуются разрешения!')
        }
      })
    },

    onBtnCloseNotification (id: number) {
      this.$store.dispatch('system/notifications_close', id)
    },

    onSystemNotificationCloseAllClick () {
      this.$store.dispatch('system/notifications_close_all')
    },

    onSSEProfileChanged () {
      this.$store.dispatch('profile/load')
    }
  }
})
</script>

<style lang="scss">
#myVideo {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  min-height: 50%;
  min-width: 50%;
}

.background--header {
  background-image: linear-gradient(to right, #3a70d4, #3a70d4, #3a70d4, #3a70d4, #3a70d4);
}

.background--drawer {
  background-image: linear-gradient(to right, #3a70d4, #3a70d4, #3a70d4, #3a70d4, #3a70d4);
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

.v-application .pth-63 {
  padding-top: 4px !important;
  padding-bottom: 3px !important;
}

.notification-shake {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 0.2s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% { transform: rotate(0deg); }
  10% { transform:  rotate(4deg); }
  20% { transform:  rotate(8deg); }
  30% { transform:  rotate(12deg); }
  40% { transform:  rotate(16deg); }
  50% { transform:  rotate(20deg); }
  60% { transform:  rotate(16deg); }
  70% { transform:  rotate(12deg); }
  80% { transform:  rotate(8deg); }
  90% { transform:  rotate(4deg); }
  100% { transform:  rotate(0deg); }
}

</style>

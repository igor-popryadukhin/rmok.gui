<template>
  <v-app v-if="profileLoading">
    <v-main>
      <v-container
        class="d-flex align-center fill-height justify-center"
        fluid
      >
        <div style="max-width: 450px">
          <app-loading message="Loading..." />
        </div>
      </v-container>
    </v-main>
  </v-app>
  <v-app
    v-else
    id="inspire"
  >
    <!-- Nav drawer -->
    <v-navigation-drawer
      ref="navigationDrawer"
      v-model="drawer"
      v-resize="onNavigationDrawerResize"
      :mini-variant="navigation_drawer_mini"
      class="background--drawer"
      permanent
      app
      dark
    >
      <v-list-item style="height: 50px">
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            RMOK
          </v-list-item-title>
          <v-list-item-subtitle v-if="profile.role">
            {{ profile.role.name }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />
      <v-list dense>
        <template
          v-for="(mainMenuItem, mainMenuIndex) in mainMenu"
        >
          <v-list-group
            v-if="mainMenuItem.children"
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
            v-else
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

      <template #append>
        <div class="pa-2">
          <v-btn
            to="/help"
            text
            block
            tile
            disabled
          >
            {{ $tc('Help') }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App bar -->
    <v-app-bar
      elevation="0"
      :height="50"
      class="background--header"
      app
      dark
    >
      <v-app-bar-nav-icon
        @click.stop="navigation_drawer_mini = !navigation_drawer_mini"
      />

      <v-toolbar
        :height="50"
        class="tool-bar"
        flat
      >
        <v-spacer />
        <v-toolbar-items>
          <!-- Системные уведомления -->
          <v-menu
            v-model="notificationsVisible"
            :close-on-content-click="false"
            nudge-left="150"
            offset-y
          >
            <template #activator="{ on, attrs }">
              <v-btn
                :disabled="notificationsItems.length === 0"
                text
                v-bind="attrs"
                v-on="on"
              >
                <v-icon :class="notificationShakeProcess ? 'notification-shake' : ''">
                  mdi-bell
                </v-icon>
                <v-badge
                  v-if="notificationsCount > 0"
                  color="red"
                  :content="notificationsCount > 99 ? '99+' : notificationsCount"
                />
              </v-btn>
            </template>
            <v-card
              max-width="800"
              min-width="450"
              flat
              tile
            >
              <v-card-text
                class="overflow-y-auto"
                style="max-height: 500px"
              >
                <v-list>
                  <template v-for="(item, itemIndex) in notificationsItems">
                    <v-list-item
                      :key="itemIndex"
                      link
                    >
                      <v-list-item-icon v-if="item.icon">
                        <v-icon color="grey">
                          {{ item.icon }}
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
          <!-- Системные уведомления -->
          <!-- Меню аккаунта -->
          <v-menu
            offset-y
            min-width="300"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                text
                tile
                v-on="on"
              >
                <v-icon
                  v-if="profile.status === 'available'"
                  size="20"
                  class="mr-2"
                >
                  mdi-check-circle-outline
                </v-icon>
                <v-icon
                  v-else-if="profile.status === 'do_not_disturb'"
                  size="20"
                  class="mr-2"
                >
                  mdi-minus-circle-outline
                </v-icon>
                <v-icon
                  v-else-if="profile.status === 'coffee_break'"
                  size="20"
                  class="mr-2"
                >
                  mdi-pause-circle-outline
                </v-icon>
                {{ profile.first_name || profile.email || profile.login }}
                <!-- Подключен и зарегистрирован -->
                <span
                  v-if="$dialer.isConnected() && $dialer.isRegistered()"
                  class="dialer-indicator dialer-indicator-connected-and-registered ml-1"
                />
                <!-- Подключен -->
                <span
                  v-else-if="$dialer.isConnected()"
                  class="dialer-indicator dialer-indicator-connected ml-1"
                />
                <!-- Не подключен -->
                <span
                  v-else
                  class="dialer-indicator dialer-indicator-disconnected ml-1"
                />
              </v-btn>
            </template>
            <v-card>
              <v-card-text
                v-if="profile.project"
                class="px-0 py-0"
              >
                <v-list>
                  <v-list-item>
                    <v-list-item-avatar class="primary">
                      <span style="color: white">
                        {{ profile.abbreviation }}
                      </span>
                    </v-list-item-avatar>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="text-h6">
                        {{ profile.full_name }}
                      </v-list-item-title>
                      <v-list-item-subtitle v-if="profile.group">
                        @{{ profile.login }} ({{ profile.group.name }})
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-else>
                        @{{ profile.login }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- Проект -->
                  <v-list-item
                    v-if="profile.project"
                    link
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $tc('Current project') }}
                      </v-list-item-title>
                      <v-list-item-subtitle>{{ profile.project.name }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <!-- Смена проекта TODO: Реализовать обработчик/механизм смены проекта-->
                    <v-list-item-action>
                      <v-icon>mdi-menu-down</v-icon>
                    </v-list-item-action>
                    <!-- Смена проекта -->
                  </v-list-item>
                  <!-- Проект -->
                </v-list>
              </v-card-text>
              <v-divider v-if="profile.project" />
              <!-- Статусы -->
              <v-card-text class="px-0 py-0">
                <v-list
                  class="pl-0 pr-0"
                  tile
                  dense
                >
                  <v-list-item-group :value="profile.status">
                    <v-list-item
                      value="available"
                      link
                      @click="onStatusListItemClick('available')"
                    >
                      <v-list-item-icon>
                        <v-icon>
                          mdi-check-circle-outline
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ $tc('Available') }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      value="do_not_disturb"
                      link
                      @click="onStatusListItemClick('do_not_disturb')"
                    >
                      <v-list-item-icon>
                        <v-icon>
                          mdi-minus-circle-outline
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ $tc('Do not disturb') }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      value="coffee_break"
                      link
                      @click="onStatusListItemClick('coffee_break')"
                    >
                      <v-list-item-icon>
                        <v-icon>
                          mdi-pause-circle-outline
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ $tc('Перерыв') }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>
              <!-- Статусы -->
              <v-card-text class="px-0 py-0">
                <v-divider />
              </v-card-text>
              <v-card-text class="px-0 py-0">
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
              </v-card-text>
            </v-card>
          </v-menu>
          <!-- Меню аккаунта -->
        </v-toolbar-items>
      </v-toolbar>
    </v-app-bar>

    <!-- Main -->
    <v-main>
      <v-container
        ref="container"
        v-resize="onContainerResize"
        class="main-container"
        fluid
      >
        <v-fade-transition>
          <router-view v-show="showRouterView" />
        </v-fade-transition>
      </v-container>
    </v-main>
    <div
      v-if="degradation"
      id="blur"
    />

    <!-- <editor-fold desc="Диалог процесса выполнения"> -->
    <v-dialog
      v-model="progressDialog.visible"
      overlay-opacity="0.3"
      width="300"
    >
      <v-card
        color="primary"
        dark
        tile
      >
        <v-card-text>
          <div style="height: 20px">
            {{ progressDialog.message }}
          </div>
          <v-progress-linear
            v-model="progressDialog.progress"
            :indeterminate="progressDialog.progress === 0"
            height="16"
            color="white"
            class="mb-0"
          >
            <strong
              v-if="progressDialog.progress > 0"
              class="black--text"
            >{{ Math.ceil(progressDialog.progress) }}%</strong>
          </v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- </editor-fold> -->
  </v-app>
</template>

<script lang="ts">
import { Calls } from '@/api/Calls'
import APIError from '@/api/classes/APIError'
import Notification from '@/api/interfaces/Notification'
import { Credentials, RTCConfiguration } from '@/api/interfaces/PBXConfiguration'
import AppBase from '@/AppBase'
import AppIncomingCallDialog from '@/components/AppIncomingCallDialog/AppIncomingCallDialog.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import SSEMessage from '@/interfaces/SSEMessage'
import VNavigationDrawer from '@/interfaces/VNavigationDrawer'
import { ProfileState } from '@/store/profile/state'
import { sleep } from '@/Utils'
import debounce from '@/utils/debounce'
import { makeAudioElement } from '@/utils/utils'
import { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import debug from 'debug'
import { EndEvent, IncomingEvent, OutgoingEvent, RTCSession } from 'jssip/lib/RTCSession'
import { IncomingRTCSessionEvent, OutgoingRTCSessionEvent } from 'jssip/lib/UA'
import Component from 'vue-class-component'
import { Ref } from 'vue-property-decorator'
import { POSITION } from 'vue-toastification'
import SSEEvents from './SSEEvents'
import WS from './WS'

const appDebug = debug('APP')
const debugDialer = appDebug.extend('DIALER')
const debugDialerEvent = appDebug.extend('DIALER-EVENT')

// eslint-disable-next-line no-use-before-define
@Component<DefaultLayout>({
  mixins: [WS, SSEEvents],
  components: { AppLoading },
  computed: {
    navigation_drawer_mini: {
      get () {
        return this.$store.getters['settings/navigation_drawer_mini']
      },
      set (value: boolean) {
        this.$store.commit('settings/navigation_drawer_mini', value)
      }
    }
  }
})
export default class DefaultLayout extends AppBase {
  progressDialog = {
    visible: false,
    message: '',
    progress: 0
  }

  profileLoading = true
  showRouterView = false
  audio = makeAudioElement()
  audioPlayed = false
  accountMenuItems = [
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
  ]

  dialog = false
  drawer = true
  notificationShakeProcess = false
  timerId = 0
  degradation = false
  dialerIsInitialize = false

  // Вычисляемые свойства

  // Системные уведомления
  get notificationsVisible () { return this.$store.getters['notifications/visible'] }
  set notificationsVisible (value: boolean) { this.$store.commit('notifications/visible', value) }
  get notificationsCount () { return this.$store.getters['notifications/count'] }
  set notificationsCount (value: number) { this.$store.commit('notifications/count', value) }
  get notificationsItems (): Notification[] { return this.$store.getters['notifications/items'] }
  set notificationsItems (value: Notification[]) { this.$store.commit('notifications/items', value) }
  // Системные уведомления

  get profile (): ProfileState { return this.$store.state.profile }
  get profilePBXCredentials (): Credentials { return this.$store.getters['profile/pbx_configuration_credentials'] }
  get profileRTCConfiguration (): RTCConfiguration { return this.$store.getters['profile/pbx_configuration_rtc_configuration'] }

  get contactIncomingId () { return this.$store.state.contact_incoming.id }
  get contactIncomingContactName () { return this.$store.state.contact_incoming.contact_name }

  get mainMenu () {
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
        visible: true
      },
      {
        title: 'Очередь',
        icon: 'mdi-human-queue',
        list_item: {
          to: {
            name: 'queue'
          }
        },
        new: true,
        visible: [17, 82, 274].includes(this.profile.id)
      },
      {
        title: 'Tasks',
        icon: 'mdi-book-check',
        list_item: {
          to: {
            name: 'tasks'
          }
        },
        // badge: {
        //   content: 1 > 99 ? '99+' : 0,
        //   visible: 2 > 0,
        //   color: '#ff5722'
        // },
        visible: true
      },
      {
        title: 'Contacts',
        icon: 'mdi-contacts',
        list_item: {
          to: {
            name: 'contacts'
          }
        },
        visible: true
      },
      {
        title: 'Roles',
        icon: 'mdi-puzzle',
        list_item: {
          to: {
            name: 'roles'
          }
        },
        visible: this.$isGranted('ROLE_MANAGEMENT')
      },
      // {
      //   title: 'Groups',
      //   icon: 'mdi-account-group',
      //   list_item: {
      //     to: {
      //       name: 'groups_list'
      //     }
      //   },
      //   visible: this.$isGranted('USER_GROUP_MANAGEMENT')
      // },
      {
        title: 'Users',
        icon: 'mdi-account-multiple-outline',
        list_item: {
          to: {
            name: 'users'
          }
        },
        visible: this.$isGranted(['USER_MANAGEMENT'])
      },
      {
        title: 'Projects',
        icon: 'mdi-projector-screen',
        list_item: {
          to: {
            name: 'projects'
          }
        },
        visible: this.$isGranted(['PROJECTS_MANAGEMENT'])
      },
      {
        title: 'Auto dialer',
        icon: 'mdi-robot',
        list_item: {
          to: {
            name: 'auto_dialer_params'
          }
        },
        visible: this.$isGranted('AUTODIALER_MANAGEMENT')
      },
      {
        title: 'Scenarios',
        icon: 'mdi-script-text',
        list_item: {
          to: {
            name: 'scenarios'
          }
        },
        visible: false// this.$isGranted('SCENARIO_MANAGEMENT')
      },
      {
        title: 'Statistic',
        active: false,
        visible: true,
        children: [
          {
            attrs: {
              to: {
                name: 'statistics_recent_calls'
              }
            },
            icon: '',
            title: 'Last call statistics',
            visible: true
          },
          {
            attrs: {
              to: {
                name: 'statistics_all_calls'
              }
            },
            icon: '',
            title: 'Statistics for all calls',
            visible: this.$isGranted(['ROLE_ADMIN', 'STATISTICS_ALL_CALLS'])
          },
          {
            attrs: {
              to: {
                name: 'statistics_call_count'
              }
            },
            icon: '',
            title: 'By the number of calls',
            visible: this.$isGranted(['ROLE_ADMIN', 'STATISTICS_CALL_COUNT'])
          },
          {
            attrs: {
              to: {
                name: 'statistics_activity'
              }
            },
            icon: '',
            title: 'Employment of employees',
            visible: this.$isGranted(['ROLE_ADMIN', 'STATISTICS_ACTIVITY'])
          },
          {
            attrs: {
              to: {
                name: 'statistics_unauthorized_breaks'
              }
            },
            icon: '',
            title: 'Unauthorized breaks',
            visible: this.$isGranted(['ROLE_ADMIN', 'STATISTICS_UNAUTHORIZED_BREAKS'])
          }
        ],
        icon: 'mdi-chart-arc',
        list_item: {}
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
      },
      {
        active: false,
        icon: 'mdi-dev-to',
        title: 'Only for developers',
        list_item: {
          to: {
            name: 'development'
          }
        },
        visible: process.env.NODE_ENV === 'development'
      }
    ].filter((e) => e.visible)
  }
  // Вычисляемые свойства

  @Ref('navigationDrawer') readonly navigationDrawer: VNavigationDrawer
  @Ref('container') readonly container: HTMLElement

  public created () {
    this.onContainerResize = debounce(this.onContainerResize, 500)

    this.$store.dispatch('account/busy_state', false)

    this.$root.$on('main-process-dialog-show', this.onMainProcessDialogShow)
    this.$root.$on('main-process-dialog-update', this.onMainProcessDialogUpdate)
    this.$root.$on('main-process-dialog-hide', this.onMainProcessDialogHide)

    this.$root.$on('sse-profile-changed', this.onSSEProfileChanged)

    // Событие сработает когда пользователь не будет активен в течении 60 секунд
    this.$ifvisible.setIdleDuration(120)
    this.$ifvisible.on('idle', this.ifVisibleIdleHandler)
    this.$ifvisible.on('wakeup', this.ifVisibleWakeupHandler)

    navigator
      .mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        this.audio = new Audio()
      }).catch(function (err) {
        console.log(err.name + ': ' + err.message)
      })

    setInterval(() => {
      if (['connecting', 'accepted', 'progress'].includes(this.$dialer.state)) {
        this.$ifvisible.wakeup()
      }
    }, 1000)
  }

  public mounted () {
    this.$store.dispatch('profile/fetch')
      .then(() => {
        this.profileLoading = false
        // Что бы не наблюдать построение элементов, покажем их через 300 ms
        setTimeout(() => (this.showRouterView = true), 300)
        this.sseInitialize()

        if (this.profilePBXCredentials.login) { this.dialerInitialize() }

        if (!this.profile.tz) {
          this.$axios.patch('/account/profile', {
            tz: dayjs.tz.guess()
          })
        }
      })

    this.$store.dispatch('notifications/fetch')

    this.audio.onplay = () => {
      this.audioPlayed = true
    }
    this.audio.onended = () => {
      this.audioPlayed = false
    }
  }

  public beforeDestroy () {
    this.$root.$off('sse-profile-changed', this.onSSEProfileChanged)
    this.$ifvisible.off('idle', this.ifVisibleIdleHandler)
    this.$ifvisible.off('wakeup', this.ifVisibleWakeupHandler)

    this.$root.$off('main-process-dialog-show', this.onMainProcessDialogShow)
    this.$root.$off('main-process-dialog-update', this.onMainProcessDialogUpdate)
    this.$root.$off('main-process-dialog-hide', this.onMainProcessDialogHide)

    clearInterval(this.timerId)
  }

  private dialerInitialize () {
    debugDialer('Dialer initialize...')
    // Обработчики событий телефонии.

    this.$dialer.off('newRTCSession', this.onNewRTCSession)

    // RTC Config
    this.$dialer.pcConfig = {
      iceServers: this.profileRTCConfiguration.ice_servers
        .map((value) => {
          if (value.credential) {
            return {
              credential: value.credential,
              credentialType: value.credential_type,
              urls: value.urls,
              username: value.username
            }
          }
          return {
            urls: value.urls
          }
        }),

      bundlePolicy: this.profileRTCConfiguration.bundle_policy,
      iceCandidatePoolSize: this.profileRTCConfiguration.ice_candidate_pool_size,
      iceTransportPolicy: this.profileRTCConfiguration.ice_transport_policy
    }

    if (this.profileRTCConfiguration.rtcp_mux_policy) {
      this.$dialer.pcConfig.rtcpMuxPolicy = this.profileRTCConfiguration.rtcp_mux_policy
    }

    debugDialer('pcConfig: %o', this.$dialer.pcConfig)

    const schema = this.profilePBXCredentials.schema
    const host = this.profilePBXCredentials.server
    const port = this.profilePBXCredentials.port
    const login = this.profilePBXCredentials.login
    const password = this.profilePBXCredentials.password

    this.$dialer.configure(`${schema}://${host}:${port}/ws`, {
      display_name: this.profile.full_name,
      password: password,
      realm: host,
      uri: `sip:${login}@${host}`,
      candidateReadyTimeOut: this.profileRTCConfiguration.candidate_ready_timeout
    })
    this.$dialer.on('newRTCSession', this.onNewRTCSession)

    // Подключение в зависимости от состояния статуса пользователя.
    if (['available', 'do_not_disturb'].includes(this.profile.status)) {
      if (!this.$dialer.isConnected()) {
        this.$dialer.connect()
      }
    }
  }

  /**
   * Fired for an incoming or outgoing session/call.
   * @param newRTCSession
   */
  private onNewRTCSession (newRTCSession: IncomingRTCSessionEvent | OutgoingRTCSessionEvent) {
    debugDialerEvent('NewRTCSession %o', newRTCSession)

    // Обработчик прогресса вызова
    newRTCSession.session.on('connecting', (event) => {
      this.onSessionConnecting(newRTCSession.session, event)
    })

    // Обработчик прогресса вызова
    newRTCSession.session.on('progress', (event: IncomingEvent | OutgoingEvent) => {
      this.onSessionProgress(newRTCSession.session, event)
    })

    // Обработчик принятия вызова
    newRTCSession.session.on('accepted', (event: IncomingEvent | OutgoingEvent) => {
      this.onSessionAccepted(newRTCSession.session, event)
    })

    // Обработчик ошибок
    newRTCSession.session.on('failed', (event: EndEvent) => {
      this.onSessionFailed(newRTCSession.session, event)
    })

    // Обработчик завершения
    newRTCSession.session.on('ended', (event: EndEvent) => {
      this.onSessionEnded(newRTCSession.session, event)
    })

    // Call-ID – идентификатор вызова.
    newRTCSession.session.data.call_id = newRTCSession.request.getHeader('Call-ID')

    if (newRTCSession.session.direction === 'incoming') {
      this.playAudio('/sounds/ringing2.mp3', true) // Проигрываю мелодию входящего вызова.
    }

    this.$ifvisible.wakeup()
  }

  /**
   * Запускается после добавления локального медиапотока в RTCSession и до начала сбора
   * ICE для начального запроса INVITE или передачи ответа «200 OK».
   *
   * @param session
   * @param event
   */
  private onSessionConnecting (session: RTCSession, event) {
    this.$root.$emit('dialer-session-connection', session, event)

    debugDialerEvent('Connecting %o %o', session, event)
  }

  /**
   * Срабатывает при получении или генерации ответа класса 1XX SIP (> 100) на запрос INVITE.
   *
   * @param session
   * @param event
   */
  private onSessionProgress (session: RTCSession, event: IncomingEvent | OutgoingEvent) {
    this.$root.$emit('dialer-session-progress', session, event)

    // Если входящий
    if (session.direction === 'incoming') {
      session.data.target = session.remote_identity.uri.user // Номер входящего

      debugDialerEvent('Входящий: %s', session.data.target)

      // Загружаю информацию о контакте с сервера.
      this.$store.dispatch('contact_incoming/get_by_phone_number', session.data.target)
      this.$store.commit('contact_incoming/contact_name', session.data.target)

      // Показать диалог входящего.
      this.$toast({
        component: AppIncomingCallDialog,
        props: {
          // Будет вычислять новое значение без обновления всего состояния
          display: () => this.contactIncomingContactName
        },
        listeners: {
          answer: this.onIncomingDialogAnswerClick,
          hangup: this.onIncomingDialogHangupClick
        }
      }, {
        id: 'incoming-dialog',
        icon: false,
        timeout: 0,
        closeButton: false,
        closeOnClick: false,
        toastClassName: 'app-incoming-call-dialog',
        bodyClassName: '',
        position: POSITION.TOP_CENTER,
        draggable: false
      })
    }

    debugDialerEvent('Progress %o %o', session, event)
  }

  /**
   * Срабатывает, когда звонок принят (2XX received/sent).
   *
   * @param session
   * @param event
   */
  private onSessionAccepted (session: RTCSession, event: IncomingEvent | OutgoingEvent) {
    this.$toast.dismiss('incoming-dialog')

    setTimeout(() => (this.stopAudio()), 500)

    this.$root.$emit('dialer-session-accepted', session, event)

    debugDialerEvent('Accepted %o %o', session, event)
  }

  /**
   * Завершение диалога.
   *
   * @param session
   * @param event
   */
  private onSessionEnded (session: RTCSession, event: EndEvent) {
    this.$toast.dismiss('incoming-dialog')

    setTimeout(() => (this.stopAudio()), 500)

    this.onSessionFinality(session, event)

    this.$root.$emit('dialer-session-ended', session, event)
    this.$root.$emit('dialer-session-finality', session, event) // Финальный

    debugDialerEvent('Ended %o %o', session, event)
  }

  /**
   * Срабатывает, когда сеанс не может быть установлен.
   *
   * @param session
   * @param event
   */
  private onSessionFailed (session: RTCSession, event: EndEvent) {
    this.$toast.dismiss('incoming-dialog')

    setTimeout(() => (this.stopAudio()), 500)

    this.onSessionFinality(session, event)
    this.$root.$emit('dialer-session-failed', session, event)
    this.$root.$emit('dialer-session-finality', session, event)

    debugDialerEvent('Failed %o %o', session, event)

    if (event.originator === 'local') {
      // Локальный
      if (event.cause === 'Canceled') {
        this.$toast.info('The call was canceled by you')
      }
      if (event.cause === 'User Denied Media Access') {
        this.$toast.error('No microphone access.\n' +
          'You must provide permission to use the microphone.')
      }
    } else if (event.originator === 'remote') {
      const message = {
        status_code: (event.message as unknown as { status_code: number }).status_code || 0,
        data: (event.message as unknown as { data: string }).data || ''
      }

      if (typeof message === 'object' && 'status_code' in message) {
        if (message.status_code === 480) {
          /**
           * Q.850 описание: No answer from the user
           * SIP описание: Temporarily unavailable
           */
          if (/Q\.850;cause=19/.test(message.data)) {
            this.$toast.info('Subscriber unavailable')
          } else {
            this.$toast.error(message.data)
          }
        } else if (message?.status_code === 486) {
          /**
           * Абонент занят.
           * ----------------------------
           * Q.850 описание: User busy
           * SIP описание: Busy here
           */
          if (/Q\.850;cause=17/.test(String(message?.data || ''))) {
            this.$toast.info('The subscriber is busy')
          } else {
            this.$toast.error(message?.data)
          }
        } else if (message?.status_code === 503) {
          /**
           * Отсутствует доступный канал.
           * Эта причина указывает на то, что в настоящее время нет подходящего канала для обработки вызова.
           * ------------------------------------------------------------------------
           * Q.850 описание: No circuit, channel unavailable
           * SIP описание: Service unavailable
           */
          if (/Q\.850;cause=34/.test(String(message?.data || ''))) {
            this.$toast.info('Service unavailable')
          } else {
            this.$toast.error(message?.data)
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
          this.$toast.error(message?.data)
        }
      }
    }
  }

  /**
   * Срабатывает при завершении сессии.
   * @param session
   * @param event
   */
  private onSessionFinality (session: RTCSession, event: EndEvent) {
    this.$store.dispatch('account/busy_state', false)

    if (session.direction === 'incoming') {
      session.data.contact_id = this.contactIncomingId
      session.data.contact_name = this.contactIncomingContactName
    }

    // Данные для сохранения истории
    const historyData: Record<string, number | string | null> = {
      cause: event.cause,
      direction: session.direction,
      originator: event.originator,
      session_end_time: this.$dialer.sessionEndTime?.getTime() / 1000,
      session_start_time: this.$dialer.sessionStartTime?.getTime() / 1000,
      type: 'call',
      audio_record_id: session.data.call_id,
      target: session.data.target
    }

    // Если есть время разговора
    if ((session.start_time) && (session.end_time)) {
      historyData.start_timestamp = session.start_time.getTime() / 1000
      historyData.end_timestamp = session.end_time.getTime() / 1000
    }

    // Сохраняю историю звонка
    this.$axios.post(`/contacts/${session.data.contact_id}/history`, historyData)
      .then((response: AxiosResponse) => {
        if ([200, 201].includes(response.status)) {
          this.$store.commit('contacts/view/unsaved_call/data_contact_id', session.data.contact_id)
          this.$store.commit('contacts/view/unsaved_call/data_contact_name', session.data.contact_name)
          this.$store.commit('contacts/view/unsaved_call/data_contact_history_id', response.data.id)
          this.$store.commit('contacts/view/unsaved_call/data_call_id', session.data.call_id)
          this.$store.commit('contacts/view/unsaved_call/data_direction', session.direction)
          this.$store.commit('contacts/view/unsaved_call/unsaved', true)
        } else {
          throw new APIError(response.data)
        }
      }).catch((reason: Error) => {
        this.$toast.error(reason.message)
      })
  }
  // DIALER EVENTS

  /**
   * SSE Initialization
   */
  private sseInitialize () {
    if ('VUE_APP_SSE' in process.env) {
      const url = new URL('/.well-known/mercure', process.env.VUE_APP_SSE)

      // Темы для подписок
      url.searchParams.append('topic', `${window.origin}/users/${this.profile.id}/event`)
      url.searchParams.append('topic', `${window.origin}/users/${this.profile.id}/${this.$currentTabID}/event`)

      if (this.$isGranted(['ROLE_ADMIN'])) {
        url.searchParams.append('topic', `${window.origin}/administration`)
      }

      const eventSource = new EventSource(url, {
        withCredentials: true
      })

      eventSource.addEventListener('event', (event: Event) => {
        if (event instanceof MessageEvent) {
          const obj: SSEMessage = JSON.parse(event.data)

          appDebug.extend('SSE').extend('EVENT')('%o', obj)

          // Кидаем сообщение на корневую шину
          this.$root.$emit('sse-' + obj.name, obj)
        }
      })

      // Системные уведомления.
      eventSource.addEventListener('system-notification', (event: Event) => {
        if (event instanceof MessageEvent) {
          const obj = JSON.parse(event.data) as Notification
          appDebug.extend('SSE').extend('SYSTEM-NOTIFICATION')('%o', obj)

          const notifications = this.notificationsItems.map((value) => value)
          if (notifications.findIndex(value => value.id === obj.id) === -1) {
            notifications.unshift(obj)
            this.notificationsItems = notifications
            this.notificationsCount++
          }

          this.notificationShake()
          if (this.$dialer.state === 'idle') {
            this.playAudio('/sounds/notifications/1.mp3')
          }

          this.$root.$emit('sse-system-notification', obj)
        }
      })

      // SSE типа message
      eventSource.onmessage = (event) => {
        // Emit в корневой экземпляр
        this.$root.$emit('root-sse-message', event.data)
      }
    }
  }

  private notificationShake () {
    this.notificationShakeProcess = true
    setTimeout(() => {
      this.notificationShakeProcess = false
    }, 800)
  }

  private onBtnCloseNotification (id: number) {
    this.$store.dispatch('notifications/close', id)
  }

  private onSystemNotificationCloseAllClick () {
    this.$store.dispatch('notifications/close_all')
  }

  /**
   * Срабатывает каждый раз когда меняются параметры профиля.
   * Так же срабатывает если параметры изменила третья сторона.
   */
  private onSSEProfileChanged () {
    this.$store.dispatch('profile/fetch')
      .then(() => {
        // Механизм предотвращения инициализации
        // телефонии в процессе её использования.
        if (!this.dialerIsInitialize) {
          const checkState = async (resolve: CallableFunction) => {
            while (true) {
              // Проверяю состояние простоя
              if (this.$dialer.state === 'idle') {
                break
              }
              await sleep(1000)
            }
            resolve()
          }

          // Выполняем повторную инициализацию только в случае простоя.
          new Promise<void>((resolve) => {
            checkState(resolve)
          }).then(() => {
            this.dialerInitialize() // Пришло время выполнить инициализацию.
            this.dialerIsInitialize = false
          })

          this.dialerIsInitialize = true
        }
      })
  }

  /**
   * Срабатывает когда нажали на элемент статуса.
   * @param status
   */
  private onStatusListItemClick (status: string) {
    switch (status) {
      case 'do_not_disturb':
      case 'available': {
        if (!this.$dialer.isConnected()) {
          this.$dialer.connect()
        }
        break
      }

      case 'coffee_break': {
        if (this.$dialer.isConnected()) {
          this.$dialer.disconnect()
        }
        break
      }
    }

    this.$store.dispatch('profile/set_status', status)
  }

  /**
   * Срабатывает когда нажали на кнопку отклонить вызов.
   */
  private onIncomingDialogHangupClick () {
    this.$toast.dismiss('incoming-dialog')
    this.$dialer.hangUp()
  }

  /**
   * Срабатывает когда нажали на кнопку принять вызов.
   */
  private onIncomingDialogAnswerClick () {
    this.$toast.dismiss('incoming-dialog')

    setTimeout(() => (this.$dialer.answer()))
    this.$router.push({
      name: 'contacts_view_scenario',
      params: {
        id: String(this.contactIncomingId)
      }
    })
  }

  /**
   * Срабатывает когда нет взаимодействия с вкладкой браузера в течении некоторого времени.
   */
  private ifVisibleIdleHandler () {
    // this.degradation = true
    this.$store.commit('app_state/page', 'sex')
  }

  /**
   * Срабатывает при пробуждении после сна.
   */
  private ifVisibleWakeupHandler () {
    this.degradation = false
  }

  private playAudio (src: string, loop = false, playbackRate = 1.0) {
    if (!this.audioPlayed) {
      this.audioPlayed = true
      this.audio.src = src
      this.audio.loop = loop
      this.audio.playbackRate = playbackRate
      this.audio.onended = () => {
        this.audioPlayed = false
      }
      this.audio.play().catch(() => {
        navigator
          .mediaDevices
          .getUserMedia({ audio: true })
          .then(() => {
            this.audio.play()
          }).catch(function (err) {
            console.log(err.name + ': ' + err.message)
          })
      })
    }
  }

  private stopAudio () {
    if (!this.audio.paused) {
      this.audio.pause()
    }
    this.audio.currentTime = 0.0
    this.audioPlayed = false
  }

  private onMainProcessDialogShow ({ message, progress }) {
    this.progressDialog.visible = true
    this.progressDialog.message = message
    this.progressDialog.progress = progress
  }

  private onMainProcessDialogUpdate ({ message, progress }) {
    this.progressDialog.visible = true
    this.progressDialog.message = message || this.progressDialog.message
    this.progressDialog.progress = progress || this.progressDialog.progress
  }

  private onMainProcessDialogHide () {
    this.progressDialog.visible = false
    this.progressDialog.message = ''
    this.progressDialog.progress = 0
  }

  /**
   * Срабатывает, когда изменяется размер v-navigation-drawer
   *
   * @private
   */
  private onNavigationDrawerResize () {
    this.$store.commit('settings/navigation_drawer_width', this.navigationDrawer.computedWidth)
  }

  /**
   * Срабатывает, когда изменяется размер основного контейнера
   *
   * @private
   */
  private onContainerResize () {
    this.$store.commit('settings/container_width', this.container.clientWidth)
  }
}
</script>

<style lang="scss">

.main-container {
  height: calc(100vh - 50px);
  height: -moz-calc(100vh - 50px);
  height: -webkit-calc(100vh - 50px);
  height: calc(100vh - 50px);
  overflow: auto;
}

.tool-bar {
  background-color: inherit !important;
}
.tool-bar div {
  padding: 0 !important;
}
.v-toolbar__tools {
  display: inline-flex;
  & button {
    margin-right: 5px;
  }
}

.app-incoming-call-dialog {
  background-color: #4b5360ed;
}

#blur {
  position: absolute;
  display: block;
  z-index: 999;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(3px);
}

.dialer-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 10px -1px white;

  &-connected-and-registered {
    background-color: #5af360;
    transition-property: background-color;
    transition-duration: 1s;
  }

  &-connected {
    background-color: #ffeb3b;
    transition-property: background-color;
    transition-duration: 1s;
  }

  &-disconnected {
    background-color: #f57474;
    transition-property: background-color;
    transition-duration: 1s;
  }
}

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
  padding-top: 1px !important;
  padding-bottom: 1px !important;
}

.notification-shake {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 0.2s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(4deg);
  }
  20% {
    transform: rotate(8deg);
  }
  30% {
    transform: rotate(12deg);
  }
  40% {
    transform: rotate(16deg);
  }
  50% {
    transform: rotate(20deg);
  }
  60% {
    transform: rotate(16deg);
  }
  70% {
    transform: rotate(12deg);
  }
  80% {
    transform: rotate(8deg);
  }
  90% {
    transform: rotate(4deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

// Wave effect
.v-btn__wave_effect {}

.v-btn__wave_effect .wave {
  border-radius: 50%;
  border: 2px solid #ffffff;
  position: absolute;
  animation: radio 3000ms linear infinite;
  z-index: -1;
  pointer-events: none;

  &--blue {
    border: 2px solid #76a2f4;
  }

  &--green {
    border: 2px solid #38ff00;
  }
}

.v-btn__wave_effect .wave:nth-of-type(2) {
  animation-delay: 1000ms;
}
.v-btn__wave_effect .wave:nth-of-type(3) {
  animation-delay: 2000ms;
}
.v-btn__wave_effect .wave:nth-of-type(4) {
  animation-delay: 3000ms;
}

@keyframes radio {
  0% {
    width: 0;
    height: 0;
  }
  10% {
    opacity: 0.2;
  }
  20% {
    opacity: 0.3;
  }
  30% {
    opacity: 0.4;
  }
  40% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.6;
  }
  60% {
    opacity: 0.5;
  }
  70% {
    opacity: 0.4;
  }
  80% {
    opacity: 0.3;
  }
  80% {
    opacity: 0.2;
  }
  90% {
    opacity: 0.1;
  }
  100% {
    width: 50px;
    height: 50px;
    opacity: 0;
  }
}
</style>

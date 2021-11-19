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

      <div class="v-toolbar__tools">
        <!-- Активация автонабора -->
        <template v-if="profileProjectId">
          <v-tooltip
            :open-delay="1200"
            bottom
          >
            <template #activator="{ on, attrs }">
              <v-btn
                v-if="profileMode"
                v-bind="attrs"
                :loading="modeChangeProcess"
                class="v-btn__wave_effect"
                icon
                v-on="on"
                @click="onBtnChangeModeClick"
              >
                <v-icon>
                  mdi-robot
                </v-icon>
                <template v-if="profileMode === 'incoming_autodialer'">
                  <span class="wave wave--blue" />
                  <span class="wave wave--blue" />
                  <span class="wave wave--blue" />
                </template>
              </v-btn>
            </template>
            <span v-if="profileMode === 'incoming_autodialer'">
              Режим автодозвона активен
            </span>
            <span v-else>
              Режим автодозвона не активен
            </span>
          </v-tooltip>
        </template>
        <!-- Активация автонабора -->

        <!-- Системные уведомления -->
        <v-menu
          v-model="systemNotificationsVisible"
          :close-on-content-click="false"
          nudge-left="150"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-btn
              :disabled="systemNotifications.length === 0"
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
                      <v-btn
                        v-if="item.url && (item.link_type === 'file')"
                        style="max-width: 112px;"
                        color="primary"
                        outlined
                        x-small
                        tile
                        @click="onFileDownload(item.url)"
                      >
                        {{ $tc('Download') }}
                        <v-icon
                          right
                          dark
                        >
                          mdi-cloud-download
                        </v-icon>
                      </v-btn>
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
      </div>

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
              v-if="$profile.status === 'available'"
              size="20"
              class="mr-2"
            >
              mdi-check-circle-outline
            </v-icon>
            <v-icon
              v-else-if="$profile.status === 'do_not_disturb'"
              size="20"
              class="mr-2"
            >
              mdi-minus-circle-outline
            </v-icon>
            <v-icon
              v-else-if="$profile.status === 'coffee_break'"
              size="20"
              class="mr-2"
            >
              mdi-pause-circle-outline
            </v-icon>
            {{ profileFirstName || profileEmail || profileLogin }}
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
            v-if="$profile"
            class="px-0 py-0"
          >
            <v-list>
              <v-list-item>
                <v-list-item-avatar class="primary">
                  <span style="color: white">
                    {{ avatar }}
                  </span>
                </v-list-item-avatar>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">
                    {{ $profile.full_name }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="$profile.group">
                    {{ $profile.login }} ({{ $profile.group.name }})
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>
                    {{ $profile.login }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Проект -->
              <v-list-item
                v-if="$profile.project"
                link
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc('Current project') }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ $profile.project.name }}</v-list-item-subtitle>
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
          <v-divider v-if="$profile" />
          <!-- Статусы -->
          <v-card-text class="px-0 py-0">
            <v-list
              class="pl-0 pr-0"
              tile
              dense
            >
              <v-list-item-group :value="$profile.status">
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
    </v-app-bar>

    <!-- Main -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <div
      v-if="degradation"
      id="blur"
    />
  </v-app>
</template>

<script lang="ts">
import { Calls } from '@/api/Calls'
import { Contacts } from '@/api/Contacts'
import SSEMessage from '@/interfaces/SSEMessage'
import { ProfileState } from '@/store/profile/state'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { RTCSession, IncomingEvent, OutgoingEvent, EndEvent } from 'jssip/lib/RTCSession'
import { IncomingRTCSessionEvent, OutgoingRTCSessionEvent } from 'jssip/lib/UA'
import debug from 'debug'
import { sleep } from '@/Utils'
import { makeAudioElement } from '@/utils/utils'
import AppIncomingCallDialog from '@/components/AppIncomingCallDialog/AppIncomingCallDialog.vue'
import { POSITION } from 'vue-toastification'

const appDebug = debug('APP')
const debugDialer = appDebug.extend('DIALER')
const debugDialerEvent = appDebug.extend('DIALER-EVENT')

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
      modeChangeProcess: false,
      audio: makeAudioElement(),
      audioPlayed: false,
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
      notificationShakeProcess: false,
      timerId: 0,
      degradation: false,
      dialerIsInitialize: false
    }
  },

  computed: {
    ...mapGetters({
      profileFirstName: 'profile/first_name',
      profileLastName: 'profile/last_name',
      profileMiddleName: 'profile/middle_name',
      profileLogin: 'profile/login',
      profileEmail: 'profile/email',
      profileMode: 'profile/mode',
      profileProjectId: 'profile/project/id',

      tasksPendingCount: 'tasks/pending_count',
      systemNotifications: 'system/notifications',
      systemNotificationsCount: 'system/notifications_count',

      contactIncomingId: 'contact_incoming/id',
      contactIncomingContactName: 'contact_incoming/contact_name',

      contactOutgoingId: 'contact_outgoing/id',
      contactOutgoingContactName: 'contact_outgoing/contact_name'
    }),

    // Состояние видимости диалога входящего вызова
    incomingDialogVisible: {
      get () {
        return this.$store.getters['incoming_dialog/visible']
      },
      set (val: boolean) {
        return this.$store.commit('incoming_dialog/visible', val)
      }
    },

    // Состояние видимости меню системных уведомлений
    systemNotificationsVisible: {
      get () {
        return this.$store.getters['system/notifications_visible']
      },
      set (val: boolean) {
        return this.$store.commit('system/notifications_visible', val)
      }
    },

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
              name: 'queue'
            }
          },
          new: true,
          visible: [17, 82, 274].includes(this.$profile.id)
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
          title: 'Auto dialer',
          icon: 'mdi-robot',
          list_item: {
            to: {
              name: 'auto_dialer_params'
            }
          },
          visible: true
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

    this.$dialer.onSessionConnecting = this.onSessionConnecting
    this.$dialer.onSessionProgress = this.onSessionProgress
    this.$dialer.onSessionAccepted = this.onSessionAccepted
    this.$dialer.onSessionEnded = this.onSessionEnded
    this.$dialer.onSessionFailed = this.onSessionFailed

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
  },

  mounted () {
    this.$store.dispatch('profile/load')
      .then(() => {
        this.sseInitialize()
        this.dialerInitialize()
      })

    // Через 5 секунд запрашиваю количество открытых задач
    if (this.$isGranted('SECTION_TASKS')) {
      setTimeout(() => {
        this.$store.dispatch('tasks/pending_count')
      }, 5000)
    }

    this.$store.dispatch('system/notifications')

    this.audio.onplay = () => {
      this.audioPlayed = true
    }
    this.audio.onended = () => {
      this.audioPlayed = false
    }
  },

  beforeDestroy () {
    this.$root.$off('sse-profile-changed', this.onSSEProfileChanged)
    this.$ifvisible.off('idle', this.ifVisibleIdleHandler)
    this.$ifvisible.off('wakeup', this.ifVisibleWakeupHandler)

    clearInterval(this.timerId)
  },

  methods: {
    dialerInitialize () {
      debugDialer('Dialer initialize...')
      // Обработчики событий телефонии.

      this.$dialer.off('newRTCSession', this.onNewRTCSession)

      // RTC Config
      this.$dialer.pcConfig = {
        iceServers: this.$store.getters['profile/pbx_configuration/rtc_configuration/ice_servers']
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

        bundlePolicy: this.$store.getters['profile/pbx_configuration/rtc_configuration/bundle_policy'],
        iceCandidatePoolSize: this.$store.getters['profile/pbx_configuration/rtc_configuration/ice_candidate_pool_size'],
        iceTransportPolicy: this.$store.getters['profile/pbx_configuration/rtc_configuration/ice_transport_policy']
      }

      if (this.$store.getters['profile/pbx_configuration/rtc_configuration/rtcp_mux_policy']) {
        this.$dialer.pcConfig.rtcpMuxPolicy = this.$store.getters['profile/pbx_configuration/rtc_configuration/rtcp_mux_policy']
      }

      debugDialer('pcConfig: %o', this.$dialer.pcConfig)

      const schema = this.$store.getters['profile/pbx_configuration/credentials/schema']
      const host = this.$store.getters['profile/pbx_configuration/credentials/server']
      const port = this.$store.getters['profile/pbx_configuration/credentials/port']
      const login = this.$store.getters['profile/pbx_configuration/credentials/login']
      const password = this.$store.getters['profile/pbx_configuration/credentials/password']

      this.$dialer.configure(`${schema}://${host}:${port}/ws`, {
        display_name: this.$profile.full_name,
        password: password,
        realm: host,
        uri: `sip:${login}@${host}`,
        candidateReadyTimeOut: this.$store.getters['profile/pbx_configuration/rtc_configuration/candidate_ready_timeout']
      })
      this.$dialer.on('newRTCSession', this.onNewRTCSession)

      // Подключение в зависимости от состояния статуса пользователя.
      if (['available', 'do_not_disturb'].includes(this.$profile.status)) {
        if (!this.$dialer.isConnected()) {
          this.$dialer.connect()
        }
      }
    },

    /**
     * Fired for an incoming or outgoing session/call.
     * @param event
     */
    onNewRTCSession (event: IncomingRTCSessionEvent | OutgoingRTCSessionEvent) {
      // Call-ID – идентификатор вызова.
      event.session.data.call_id = event.request.getHeader('Call-ID')
      this.$ifvisible.wakeup()
    },

    /**
     * Запускается после добавления локального медиапотока в RTCSession и до начала сбора
     * ICE для начального запроса INVITE или передачи ответа «200 OK».
     *
     * @param session
     * @param event
     */
    onSessionConnecting (session: RTCSession, event) {
      this.$root.$emit('dialer-session-connection', session, event)

      debugDialerEvent('Connecting %o %o', session, event)
    },

    /**
     * Срабатывает при получении или генерации ответа класса 1XX SIP (> 100) на запрос INVITE.
     *
     * @param session
     * @param event
     */
    onSessionProgress (session: RTCSession, event: IncomingEvent | OutgoingEvent) {
      this.$root.$emit('dialer-session-progress', session, event)

      // Если входящий
      if (session.direction === 'incoming') {
        this.playAudio('/sounds/ringing2.mp3', true) // Проигрываю мелодию входящего вызова.
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
    },

    /**
     * Срабатывает, когда звонок принят (2XX received/sent).
     *
     * @param session
     * @param event
     */
    onSessionAccepted (session: RTCSession, event: IncomingEvent | OutgoingEvent) {
      this.$toast.dismiss('incoming-dialog')

      this.stopAudio()
      this.$root.$emit('dialer-session-accepted', session, event)

      debugDialerEvent('Accepted %o %o', session, event)
    },

    /**
     * @param session
     * @param event
     */
    onSessionEnded (session: RTCSession, event: EndEvent) {
      this.$toast.dismiss('incoming-dialog')

      this.stopAudio()
      this.onSessionFinality(session, event)
      this.$root.$emit('dialer-session-ended', session, event)
      this.$root.$emit('dialer-session-finality', session, event) // Финальный

      debugDialerEvent('Ended %o %o', session, event)
    },

    /**
     * Срабатывает, когда сеанс не может быть установлен.
     *
     * @param session
     * @param event
     */
    onSessionFailed (session: RTCSession, event: EndEvent) {
      this.$toast.dismiss('incoming-dialog')

      this.stopAudio()
      this.onSessionFinality(session, event)
      this.$root.$emit('dialer-session-failed', session, event)
      this.$root.$emit('dialer-session-finality', session, event)

      debugDialerEvent('Failed %o %o', session, event)

      if (event.originator === 'local') {
        // Локальный
        if (event.cause === 'Canceled') {
          this.$toast.info('Call canceled')
        }
        if (event.cause === 'User Denied Media Access') {
          this.$toast.error('No microphone access.\n' +
            'You must provide permission to use the microphone.')
        }
      } else if (event.originator === 'remote') {
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
    },

    /**
     * Срабатывает при завершении сессии.
     * @param session
     * @param event
     */
    onSessionFinality (session: RTCSession, event: EndEvent) {
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
      new Contacts()
        .addHistory(session.data.contact_id, historyData)
        .then((id: number) => {
          // Удаляю из Vuex
          // this.$store.dispatch('contacts_new/items_remove_from_store', this.contactViewContactId)

          this.$store.commit('unsaved_call/data/contact_id', session.data.contact_id)
          this.$store.commit('unsaved_call/data/contact_name', session.data.contact_name)
          this.$store.commit('unsaved_call/data/contact_history_id', id)
          this.$store.commit('unsaved_call/data/call_id', session.data.call_id)
          this.$store.commit('unsaved_call/data/direction', session.direction)
          this.$store.commit('unsaved_call/unsaved', true)
        })
    },
    // DIALER EVENTS

    sseInitialize () {
      if ('VUE_APP_SSE' in process.env) {
        const url = new URL('/.well-known/mercure', process.env.VUE_APP_SSE)

        // Темы для подписок
        url.searchParams.append('topic', `${window.origin}/users/${this.$profile.id}/event`)

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

            // Что-то изменилось в задачах
            if (obj.name === 'tasks-changed') {
              if (this.$isGranted('SECTION_TASKS')) {
                this.$store.dispatch('tasks/pending_count')
              }
            } else if (obj.name === 'system-notification') {
              // Звук уведомления только если в режиме ожидания.
              this.$store.dispatch('system/notifications')
                .then(() => {
                  this.notificationShake()
                  if (this.$dialer.state === 'idle') {
                    this.playAudio('/sounds/notifications/1.mp3')
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

    /**
     * Срабатывает каждый раз когда меняются параметры профиля.
     * Так же срабатывает если параметры изменила третья сторона.
     */
    onSSEProfileChanged () {
      this.$store.dispatch('profile/load')
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
    },

    onFileDownload (name: string) {
      this.$store.dispatch('contacts_new/file_contact_download', name)
    },

    /**
     * Срабатывает когда нажали на элемент статуса.
     * @param status
     */
    onStatusListItemClick (status: string) {
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
    },

    /**
     * Срабатывает когда нажали на кнопку отклонить вызов.
     */
    onIncomingDialogHangupClick () {
      this.$toast.dismiss('incoming-dialog')
      this.$dialer.hangUp()
    },

    /**
     * Срабатывает когда нажали на кнопку принять вызов.
     */
    onIncomingDialogAnswerClick () {
      this.$toast.dismiss('incoming-dialog')

      // Сразу перехожу в карточку контакта.
      this.$router.push({
        name: 'contacts_view_scenario',
        params: {
          contact_id: String(this.contactIncomingId)
        }
      }).finally(() => {
        this.$dialer.answer()
      })
    },

    /**
     * Срабатывает при нажатии на кнопку изменения режима
     */
    onBtnChangeModeClick () {
      this.modeChangeProcess = true
      switch (this.profileMode) {
        case 'normal': {
          this.$axios.get('/account/mode/incoming_autodialer')
            .then(() => (this.$toast.info('Режим автодозвона активирован.\nОжидайте входящий вызов!')))
            .finally(() => (this.modeChangeProcess = false))
          this.$store.commit('profile/mode', 'incoming_autodialer')
          break
        }
        case 'incoming_autodialer': {
          this.$axios.get('/account/mode/normal')
            .then(() => (this.$toast.info('Режим автодозвона деактивирован.')))
            .finally(() => (this.modeChangeProcess = false))
          this.$store.commit('profile/mode', 'normal')
          break
        }
      }
    },

    /**
     * Срабатывает когда нет взаимодействия с вкладкой браузера в течении некоторого времени.
     */
    ifVisibleIdleHandler () {
      // this.degradation = true
      this.$accountMonitoring.end()
    },

    /**
     * Срабатывает при пробуждении после сна.
     */
    ifVisibleWakeupHandler () {
      this.degradation = false
    },

    /**
     * Воспроизводит любой аудиофайл.
     *
     * @param src
     * @param loop
     */
    playAudio (src: string, loop: false) {
      this.audioPlayed = true
      if (this.audioPlayed) {
        this.audio.src = src
        this.audio.loop = loop
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
    },

    stopAudio () {
      if (!this.audio.paused) {
        this.audio.pause()
      }
      this.audio.currentTime = 0.0
      this.audioPlayed = false
    }
  }
})
</script>

<style lang="scss">
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

// Wave effect

</style>

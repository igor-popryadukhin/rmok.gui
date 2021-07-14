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
      <v-toolbar-title>
        <div class="hidden-sm-and-down">RMOK</div>
        <div
          v-if="project_current"
          class="hidden-sm-and-down toolbar-title-subtitle text-lowercase"
          style="margin-top: -8px"
        >
          {{ project_current.name }}
        </div>
      </v-toolbar-title>
      <v-spacer/>

      <!-- Main search -->
      <v-autocomplete
        v-model="mainSearch.selected"
        :items="mainSearch.items"
        :search-input.sync="mainSearch.q"
        :label="$t('Search')"
        :loading="mainSearch.loading"
        class="mr-4"
        item-text="title"
        disabled
        return-object
        hide-no-data
        no-filter
        clearable
        disable-lookup
        flat
        hide-selected
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
          max-width="800"
          min-width="500"
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
                  <v-list-item-avatar v-if="item.icon">
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

      <template v-slot:extension>
        <v-breadcrumbs
          :items="breadcrumbs"
          class="pa-0"
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

    <s-incoming-r-t-c v-model="incomingDialogVisible"/>
  </v-app>
</template>

<script lang="ts">
import Account, { UserStatus } from '@/api/Account'
import Projects, { ProjectInterface } from '@/api/Projects'
import AppDialogList from '@/components/AppDialogList/AppDialogList.vue'
import { MainSearchInterface, NotificationInterface } from '@/Interfaces'
import breadcrumbs from '@/mixins/breadcrumbs'
import jssip from '@/mixins/jssip'
import SIncomingRTC from '@/snippets/SIncomingRTC/SIncomingRTC.vue'
import VInterface from '@/VInterface'
import callMachine from '@/xState/machines/callMachine'
import Vue, { VueConstructor } from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import { mapGetters } from 'vuex'
import { interpret } from 'xstate'

interface IProps {
  [key: string]: any;
}

interface IData {
  [key: string]: any;
}

interface IMethod {
  [key: string]: any;
}

interface IComputed {
  [key: string]: any;
}

export default (Vue as VueConstructor<VInterface>).extend<IData, IMethod, IComputed, IProps>({
  components: { SIncomingRTC },

  mixins: [breadcrumbs, jssip],

  data (): IData {
    return {
      accountMenuItems: [
        {
          attrs: {
            dense: true,
            link: true
          },
          icon: {
            attrs: {
              color: 'green'
            },
            name: 'mdi-check-circle-outline'
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
          },
          title: 'Available'
        },
        {
          attrs: {
            dense: true,
            link: true
          },
          icon: {
            attrs: {
              color: 'red'
            },
            name: 'mdi-do-not-disturb'
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
          },
          title: 'Do not disturb'
        },
        {
          attrs: {
            dense: true,
            link: true
          },
          icon: {
            attrs: {
              color: 'blue'
            },
            name: 'mdi-pause-circle-outline'
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
          },
          title: 'Break'
        },

        { divider: true },

        {
          attrs: {
            dense: true,
            to: {
              name: 'operator_settings_profile'
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
            click: () => {
              this.$router.replace({ name: 'login' })
              new Account().logout()
            }
          },
          title: 'Exit'
        }
      ],
      buttonMenuNotification: false,
      drawer: null,
      mainSearch: {
        debounce: debounce(function (q: string, _this: any) {
          _this.$root.$emit('root-main-search', q, (items: MainSearchInterface[]) => {
            _this.mainSearch.items = items
          })
        }, 400),
        items: [],
        loading: false,
        q: null,
        selected: null
      },
      notifications: [] as NotificationInterface[],
      projectDialog: {
        disabled: false,
        projects: [] as ProjectInterface[],
        visible: false
      },
      projects: [],
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

  mounted () {
    this.callMachineService = interpret(callMachine.withContext(this))
    this.callMachineService
      .onTransition((state: any) => {
        this.current = state
        this.context = state.context
      }).start()

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

    setTimeout(() => {
      this.loadProject()
    }, 3000)

    // Проверка установки страны
    setTimeout(() => {
      if (!this.profile_country?.id) {
        this.$data.notifications.unshift({
          title: 'Укажите страну проживания',
          message: 'Для повышения качества обслуживания, пожалуйста укажите вашу страну проживания.',
          message2: 'Нажмите на данное сообщение для редактирования вашего профиля.',
          color: 'primary',
          icon: 'mdi-message-alert-outline',
          click: (item: NotificationInterface, index: number) => {
            this.$router.push({
              name: 'operator_settings_contacts'
            }).finally(() => {
              this.$data.notifications.splice(index, 1)
            })
          }
        })
      }
    }, 10000)
  },

  computed: {
    ...mapGetters({
      profile_country: 'profile/country',
      task_pending_count: 'tasks/pending_count',
      project_current: 'project/current',
      project_available: 'project/available'
    }),

    avatar () {
      const first: string = this.$store.getters['profile/first_name'] || ''
      const last: string = this.$store.getters['profile/last_name'] || ''
      return first.charAt(0) + last.charAt(0)
    },

    mainMenu () {
      return [
        {
          attrs: {
            text: true,
            to: { name: 'operator_leads' },
            value: this.$tc('Leads')
          },
          title: this.$tc('Leads')
        },
        {
          attrs: {
            text: true,
            to: { name: 'operator_contacts_list' }
          },
          title: this.$tc('Contacts')
        },
        {
          attrs: {
            disabled: false,
            link: true,
            to: { name: 'operator_tasks_list' }
          },
          badge: () => { // Может быть как функция возвращающая объект, так и обычный объект
            let visible = false
            const attrs: any = {
              color: 'red',
              content: this.task_pending_count,
              inline: true
            }

            if (this.task_pending_count > 0) {
              visible = true
            }

            return {
              attrs,
              visible
            }
          },
          icon: '',
          title: this.$tc('Tasks')
        },
        {
          attrs: {
            link: true
          },
          children: [
            {
              attrs: {
                to: {
                  name: 'operator_statistics_recent_calls'
                }
              },
              icon: '',
              title: 'Recent call statistics',
              visible: true
            },
            {
              attrs: {
                to: {
                  name: 'operator_statistics_all_calls'
                }
              },
              icon: '',
              title: 'Statistics for all calls',
              visible: true
            }
          ],
          icon: 'mdi-chart-arc',
          title: 'Statistic'
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
    this.$store.dispatch('database/statuses') // Загрузить статусы текущего проекта пользователя
  },

  methods: {
    /**
     * Загрузить текущий проект пользователя если таковой имеется.
     * Иначе предложить выбрать из списка.
     */
    async loadProject () {
      // Загружаю доступные проекты
      await this.$store.dispatch('project/available')

      // Загружаю текущий проект пользователя и заполняю хранилище.
      await this.$store.dispatch('project/current')

      // Если хранилище не заполнено, загрузить доступные проекты и предложить выбор.
      setTimeout(async () => {
        if (!this.$store.getters['project/current']) {
          // Показать диалог выбора проекта если таковые имеются
          if (this.project_available.length > 0) {
            const instance = await this.$dialog.show(AppDialogList, {
              waitForResult: false,
              showClose: true,
              persistent: true,
              itemText: 'name',
              options: this.$store.getters['project/available'],
              onItemClick: (item: ProjectInterface) => {
                // Устанавливаю текущий проект
                new Projects()
                  .active(item.id)
                  .then(async () => {
                    // Теперь загружаю проект в хранилище
                    await this.$store.dispatch('project/current')
                    this.$root.$emit('root-project-change')
                  })

                // Закрываю диалог
                instance.close()
              }
            })
          } else {
            // Сообщить пользователю о том что у него нет проектов
            this.$toast.info(this.$tc('You don\'t have a single project'))
          }
        }
      }, 1000)
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

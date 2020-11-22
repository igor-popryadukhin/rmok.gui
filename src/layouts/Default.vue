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
            {{ $t('Your search - {q} - did not match any documents.', { q: mainSearch.q }) }}
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

      <v-btn
        text
        :to="{ path: '/leads' }"
        class="mr-1"
      >
        {{ $tc('Ringing') }}
      </v-btn>

      <v-btn
        text
        to="/contacts"
        class="mr-1"
      >
        {{ $tc('Contacts') }}
      </v-btn>

      <v-btn
        text
        to="/reports"
        class="mr-1"
      >
        {{ $tc('Reports') }}
      </v-btn>

      <v-btn
        text
        to="/calls"
        class="mr-1"
      >
        {{ $tc('Calls') }}
      </v-btn>

      <v-btn
        text
        :to="{ name: 'help' }"
        class="mr-1"
      >
        {{ $tc('Help') }}
      </v-btn>

      <!-- BELL -->
      <v-menu
        v-model="buttonMenuNotification"
        :close-on-content-click="false"
        nudge-left="150"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mr-1"
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

      <template v-if="$store.getters['profile/role_is_admin']">
        <v-tooltip
          bottom
          max-width="400"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="#00ff0a"
              :to="{ name: 'administrator' }"
              class="mr-1"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-police-badge</v-icon>
            </v-btn>
          </template>
          <span>{{ $tc('route.administrator') }}</span>
        </v-tooltip>
      </template>
      <template v-else-if="$store.getters['profile/role_is_leader_cc']">
        <v-tooltip
          bottom
          max-width="400"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="#FFEB3B"
              :to="{ name: 'call_center_manager' }"
              class="mr-1"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-police-badge</v-icon>
            </v-btn>
          </template>
          <span>{{ $tc('route.call_center_manager') }}</span>
        </v-tooltip>
      </template>
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
        <vuescroll :style="{ height: `${$screenHeight - 125}px` }" style="width: 100%">
          <router-view/>
        </vuescroll>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import breadcrumbs from '@/mixins/breadcrumbs'
import { MainSearchInterface, NotificationInterface } from '@/Interfaces'
import { debounce } from 'vuetify/src/util/helpers'
import vuescroll from 'vuescroll'
import Tasks, { TaskGetResponseInterface, TaskInterface, TaskType } from '@/api/Tasks'

export default Vue.extend({
  props: {
    source: String
  },

  components: {
    vuescroll
  },

  mixins: [breadcrumbs],

  data: () => ({
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
        name: 'profile',
        icon: 'mdi-account',
        to: {
          name: 'profile'
        }
      },
      {
        name: 'settings',
        icon: 'mdi-cog',
        to: {
          name: 'settings'
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
      {
        icon: 'mdi-contacts',
        text: 'Contacts',
        to: ''
      }
    ],
    notifications: [] as NotificationInterface[],
    projects: []
  }),

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
    avatar () {
      const first: string = this.$store.getters['profile/first_name'] || ''
      const last: string = this.$store.getters['profile/last_name'] || ''
      return first.charAt(0) + last.charAt(0)
    }
  },

  mounted () {
    this.$root.$on('root-update-notifications', this.onRootNewTasks)
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
                          this.$router.push({ path: `/contacts/${arg.contact?.id}/script` })
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

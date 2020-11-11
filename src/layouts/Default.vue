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

      <!-- If this is operator role then showing button my project -->
      <v-tooltip
        v-if="$store.getters['profile/role_is_operator']"
        bottom
        max-width="400"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            class="mr-1"
            v-on="on"
            v-bind="attrs"
            :to="{ path: '/projects' }"
          >
            <v-icon>mdi-projector-screen</v-icon>
          </v-btn>
        </template>
        <span>{{ $tc('my_projects') }}</span>
      </v-tooltip>

      <v-tooltip bottom max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            to="/contacts"
            class="mr-1"
            v-on="on"
            v-bind="attrs"
          >
            <v-icon>mdi-contacts</v-icon>
          </v-btn>
        </template>
        <span>{{ $tc('route.contacts') }}</span>
      </v-tooltip>
      <v-tooltip bottom max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            to="/leads"
            class="mr-1"
            v-on="on"
            v-bind="attrs"
          >
            <v-icon>mdi-phone-classic</v-icon>
          </v-btn>
        </template>
        <span>{{ $tc('route.leads') }}</span>
      </v-tooltip>
      <v-tooltip bottom max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            to="/calls"
            class="mr-1"
            v-on="on"
            v-bind="attrs"
          >
            <v-icon>mdi-phone-log</v-icon>
          </v-btn>
        </template>
        <span>{{ $tc('route.calls') }}</span>
      </v-tooltip>

      <!-- BELL -->
      <v-menu
        :close-on-content-click="false"
        nudge-left="150"
        open-on-hover
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
              content="!"
            />
          </v-btn>
        </template>
        <v-card v-if="notifications.length > 0">
          <v-list>
            <v-list-item
              v-for="(item, itemIndex) in notifications"
              :key="itemIndex"
              ripple
            >
              <v-list-item-avatar>
                <v-icon :color="item.color">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.message }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <v-tooltip bottom max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            :to="{ name: 'help' }"
            class="mr-1"
            v-on="on"
            v-bind="attrs"
          >
            <v-icon>mdi-help-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $tc('route.help') }}</span>
      </v-tooltip>
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
            @click="item.click || function () { console.log('item click') }"
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
        <vue-scroll :style="{ height: `${$screenHeight - 125}px` }" style="width: 100%">
          <router-view/>
        </vue-scroll>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import breadcrumbs from '@/mixins/breadcrumbs'
import { NotificationInterface } from '@/Interfaces'
import { debounce } from 'vuetify/src/util/helpers'

export default Vue.extend({
  props: {
    source: String
  },

  mixins: [breadcrumbs],

  data: () => ({
    mainSearch: {
      q: null,
      selected: null,
      loading: false,
      items: [],
      debounce: debounce(function (q: string, _this) {
        _this.$root.$emit('root-main-search', q, (items) => {
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
        click: () => {
          // todo: delete cookie
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

  created () {
    this.$store.subscribe(
      ({ payload, type }) => {
        if (type === 'project/set') {
          if (payload.statuses) {
            if (payload.statuses.length === 0) {
              this.notifications.push({
                icon: 'mdi-alert',
                color: 'red',
                title: 'Ошибка проекта!',
                message: 'У проекта нет статусов'
              })
            }
          }
        }
      }
    )
  },

  methods: {
    onInputMainSearch (e) {
      console.log(e)
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

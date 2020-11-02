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
      extension-height="30px"
      class="background--header"
    >
      <div class="offset-lg-2 offset-md-2"></div>
      <v-toolbar-title>
        <span class="hidden-sm-and-down">RMOK</span>
      </v-toolbar-title>
      <v-spacer/>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        :label="$t('search')"
        class="mr-4"
        style="max-width: 400px"
        dense
      ></v-text-field>

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
            @click="onMyProjectsButtonClick"
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
      <v-btn
        icon
        class="mr-1"
      >
        <v-icon>mdi-bell</v-icon>
      </v-btn>
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
      <template v-if="$store.getters['profile/role_is_leader_cc']">
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
      <v-menu offset-y>
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
      <div class="offset-lg-2 offset-md-2"></div>
      <template v-slot:extension>
        <v-breadcrumbs
          :items="breadcrumbs"
          class="pa-0 offset-lg-2 col-lg-8 offset-md-2 col-md-8"
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
        class="offset-lg-2 col-lg-8 offset-md-2 col-md-8 pl-2 pr-2"
      >
        {{ projects }}
        <vue-scroll :style="{ height: `${$screenHeight - 125}px` }" style="width: 100%">
          <v-fade-transition hide-on-leave>
            <router-view/>
          </v-fade-transition>
        </vue-scroll>
      </v-container>
    </v-main>
    <audio id="audio" controls style="display: none"/>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import breadcrumbs from '@/mixins/breadcrumbs'
import { Projects } from '@/api/Projects'
import PhoneNumbers from '@/components/PhoneNumbers/PhoneNumbers'

export default Vue.extend({
  props: {
    source: String
  },
  mixins: [breadcrumbs],
  data: () => ({
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
        icon: 'mdi-user',
        to: {
          name: 'profile'
        }
      },
      {
        name: 'settings',
        icon: 'mdi-settings',
        to: {
          name: 'settings'
        }
      },
      {
        name: 'exit',
        icon: 'mdi-exit',
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
    projects: []
  }),

  // watch: {
  //   $route (to, from) {
  //     const toDepth = to.path.split('/').length
  //     const fromDepth = from.path.split('/').length
  //     this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  //   }
  // },

  computed: {
    avatar () {
      const first: string = this.$store.getters['profile/first_name'] || ''
      const last: string = this.$store.getters['profile/last_name'] || ''
      return first.charAt(0) + last.charAt(0)
    }
  },

  created () {
    new Projects()
      .find()
      .then((projects) => {
        this.projects = projects.items
      })
  },

  methods: {
    onMyProjectsButtonClick () {
      this.$dialog.show(PhoneNumbers)
      new Projects()
        .find()
        .then((projects) => {
          this.projects = projects.items
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

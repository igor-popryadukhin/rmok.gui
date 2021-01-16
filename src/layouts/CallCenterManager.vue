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
      <v-toolbar-title class="d-inline-block toolbar-title">
        <div class="hidden-sm-and-down">RMOK</div>
        <div class="hidden-sm-and-down toolbar-title-subtitle">{{ $tc('For the head of the call center') }}</div>
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

      <!-- Contacts -->
      <v-btn
        class="mr-1"
        :to="{ name: 'call_center_manager_contacts' }"
        text
      >
        {{ $tc('route.call_center_manager_contacts') }}
      </v-btn>

      <!-- Users -->
      <v-btn
        class="mr-1"
        :to="{ name: 'call_center_manager_users' }"
        text
      >
        {{ $tc('route.call_center_manager_users') }}
      </v-btn>

      <!-- groups -->
      <v-btn
        class="mr-1"
        :to="{ name: 'call_center_manager_groups' }"
        text
      >
        {{ $tc('route.call_center_manager_groups') }}
      </v-btn>

      <!-- Menu reports -->
      <v-menu offset-y>
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
            v-for="(item, index) in menuReports"
            :key="index"
            :to="item.to"
          >
            <v-list-item-icon v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
              <v-list-item-subtitle>{{ $t(item.subtitle) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Avatar -->
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
        fluid
      >
        <vuescroll :ops="vueScrollOptions" :style="{ height: `${$screenHeight - 125}px` }" style="width: 100%">
          <router-view/>
        </vuescroll>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import breadcrumbs from '@/mixins/breadcrumbs'
import vuescroll from 'vuescroll/dist/vuescroll-native'
import vueScrollOptions from '@/mixins/vueScrollOptions'

export default Vue.extend({
  props: {
    source: String
  },

  components: {
    vuescroll
  },

  mixins: [breadcrumbs, vueScrollOptions],

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
        icon: 'mdi-account',
        to: {
          name: 'call_center_manager_profile'
        }
      },
      {
        name: 'settings',
        icon: 'mdi-cog',
        to: {
          name: 'call_center_manager_settings'
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
    menuReports: [
      {
        title: 'route.call_center_manager_reports_recent_calls',
        subtitle: '',
        to: {
          name: 'call_center_manager_reports_recent_calls'
        }
      },
      {
        title: 'route.call_center_manager_reports_all_calls',
        subtitle: '',
        to: {
          name: 'call_center_manager_reports_all_calls'
        }
      }
    ],
    mainMenu: [
      {
        icon: 'mdi-contacts',
        text: 'Contacts',
        to: ''
      }
    ]
  }),

  computed: {
    avatar () {
      const first: string = this.$store.getters['profile/first_name'] || ''
      const last: string = this.$store.getters['profile/last_name'] || ''
      return first.charAt(0) + last.charAt(0)
    }
  },

  beforeMount () {
    this.vueScrollOptions.bar.keepShow = false
    delete this.vueScrollOptions.rail
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

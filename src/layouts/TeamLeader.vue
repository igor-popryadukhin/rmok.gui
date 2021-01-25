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
        <div class="hidden-sm-and-down toolbar-title-subtitle">Для руководителя группы</div>
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

      <!-- Users -->
      <v-btn
        text
        :to="{ path: '/team-leader/users' }"
        class="mr-1"
      >
        {{ $tc('route.team_leader_users') }}
      </v-btn>

      <!-- Menu reports -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            class="mr-5"
            v-on="on"
            v-bind="attrs"
          >
            {{ $tc('route.team_leader_reports') }}
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
            <v-divider v-if="accountMenuItem.divider" :key="accountMenuItemIndex" />
            <v-subheader
              v-else-if="accountMenuItem.subheader"
              :key="accountMenuItemIndex"
              v-bind="accountMenuItem"
            >{{ accountMenuItem.title }}</v-subheader>
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
        :style="{ height: `${$screenHeight - $headerHeight}px` }"
        fluid
      >
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import breadcrumbs from '@/mixins/breadcrumbs'
import vueScrollOptions from '@/mixins/vueScrollOptions'

export default Vue.extend({
  props: {
    source: String
  },

  mixins: [breadcrumbs, vueScrollOptions],

  data () {
    return {
      settings: {
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: false
      },
      dialog: false,
      drawer: null,
      accountMenuItems: [
        {
          title: 'Profile',
          icon: {
            name: 'mdi-account',
            attrs: {}
          },
          attrs: {
            dense: true,
            to: {
              name: 'team_leader_profile'
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
            click: () => {
              this.$dialog.confirm({
                title: this.$tc('Подтверждение действия.'),
                text: this.$tc('Вы действительно хотите выйти?'),
                actions: {
                  false: {
                    color: 'red',
                    text: this.$tc('no')
                  },
                  true: {
                    color: 'primary',
                    text: this.$tc('yes'),
                    handle: () => {
                      this.$router.replace({ name: 'login' })
                    }
                  }
                }
              })
            }
          }
        }
      ],
      menuReports: [
        {
          title: 'route.team_leader_reports_recent_calls',
          subtitle: '',
          to: {
            name: 'team_leader_reports_recent_calls'
          }
        },
        {
          title: 'route.team_leader_reports_all_calls',
          subtitle: '',
          to: {
            name: 'team_leader_reports_all_calls'
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
    }
  },

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
</style>

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

      <v-toolbar-items style="height: 40px; margin-right: 16px">
        <template
          v-for="(mainMenuItem, mainMenuIndex) in mainMenu"
        >
          <v-menu
            v-if="mainMenuItem.menu"
            :key="mainMenuIndex"
            offset-y
          >
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
                v-for="(itemMenu, itemMenuIndex) in mainMenuItem.menu"
                :key="itemMenuIndex"
                :to="itemMenu.to"
              >
                <v-list-item-icon v-if="item.icon">
                  <v-icon>{{ itemMenu.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $tc(itemMenu.title) }}</v-list-item-title>
                  <v-list-item-subtitle v-if="itemMenu.subtitle">{{ $t(itemMenu.subtitle) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            v-else
            :key="mainMenuIndex"
            v-bind="mainMenuItem.attrs"
            v-text="mainMenuItem.text || 'no text'"
          >
          </v-btn>
        </template>
      </v-toolbar-items>

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
    <v-main class="v-main">
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
              name: 'call_center_manager_profile'
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
      mainMenu: [
        {
          text: this.$tc('Contacts'),
          attrs: {
            text: true,
            to: { name: 'call_center_manager_contacts' }
          }
        },
        {
          text: this.$tc('Users'),
          attrs: {
            text: true,
            to: { name: 'call_center_manager_users' }
          }
        },
        {
          text: this.$tc('Projects'),
          attrs: {
            text: true,
            to: { name: 'call_center_manager_projects_list' }
          }
          // menu: [
          //   {
          //     class: '',
          //     title: 'call_center_manager_reports_recent_calls',
          //     to: {
          //       name: 'call_center_manager_reports_recent_calls'
          //     }
          //   },
          //   {
          //     class: '',
          //     title: 'call_center_manager_reports_all_calls',
          //     to: {
          //       name: 'call_center_manager_reports_all_calls'
          //     }
          //   }
          // ]
        }
      ]
      // mainMenu: [
      //   {
      //     class: '',
      //     to: {
      //       name: 'call_center_manager_contacts'
      //     }
      //   },
      //   {
      //     class: '',
      //     to: {
      //       name: 'call_center_manager_users'
      //     }
      //   },
      //   {
      //     class: '',
      //     title: 'ЯЯЯ',
      //     to: {
      //       name: 'call_center_manager_projects_list'
      //     }
      //   },
      //   {
      //     class: '',
      //     menu: [
      //       {
      //         class: '',
      //         title: 'call_center_manager_reports_recent_calls',
      //         to: {
      //           name: 'call_center_manager_reports_recent_calls'
      //         }
      //       },
      //       {
      //         class: '',
      //         title: 'call_center_manager_reports_all_calls',
      //         to: {
      //           name: 'call_center_manager_reports_all_calls'
      //         }
      //       }
      //     ]
      //   }
      // ]
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

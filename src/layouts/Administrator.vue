<template>
  <v-app id="inspire">

    <!-- Nav drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="navigation_drawer_mini"
      class="background--drawer"
      permanent
      app
      dark
    >
      <v-list-item class="px-2">
        <v-list-item-avatar class="v-icon--link" color="white">
          <v-btn
            icon
            link
            color="primary"
            @click.stop="navigation_drawer_mini = !navigation_drawer_mini"
          >
            R
          </v-btn>
        </v-list-item-avatar>
        <v-list-item-title>RMOK</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

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
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon v-text="mainMenuItem.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $tc(mainMenuItem.title) }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <template v-for="(mainMenuItemChildren, mainMenuItemChildrenIndex) in mainMenuItem.children">
              <v-list-item
                v-if="mainMenuItemChildren.visible"
                :key="`child-${mainMenuItemChildrenIndex}`"
                v-bind="mainMenuItemChildren.attrs"
                link
              >
                <v-tooltip
                  open-delay="500"
                  color="primary"
                  right
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-title
                      v-on="on"
                      v-bind="attrs"
                    >
                      {{ $tc(mainMenuItemChildren.title) }}
                    </v-list-item-title>
                  </template>
                  <span>{{ $tc(mainMenuItemChildren.title) }}</span>
                </v-tooltip>
                <v-list-item-icon>
                  <v-icon v-text="mainMenuItemChildren.icon"></v-icon>
                </v-list-item-icon>
              </v-list-item>
            </template>
          </v-list-group>

          <v-divider v-else-if="mainMenuItem.divider" :key="mainMenuIndex" />

          <v-list-item
            v-else-if="mainMenuItem.visible"
            :key="`main-menu-list-item-${mainMenuIndex}`"
            v-bind="mainMenuItem.list_item"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ mainMenuItem.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-tooltip
                open-delay="500"
                color="primary"
                right
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-title
                    v-on="on"
                    v-bind="attrs"
                  >
                    {{ $tc(mainMenuItem.title) }}
                  </v-list-item-title>
                </template>
                <span>{{ $tc(mainMenuItem.title) }}</span>
              </v-tooltip>
            </v-list-item-content>
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
      <v-app-bar-nav-icon @click.stop="navigation_drawer_mini = !navigation_drawer_mini"></v-app-bar-nav-icon>
      <v-toolbar-title class="d-inline-block toolbar-title mr-md-5 mr-lg-5">
        <div class="hidden-sm-and-down">RMOK</div>
        <div class="hidden-sm-and-down toolbar-title-subtitle text-lowercase">{{ $store.getters['profile/role_name'] }}</div>
      </v-toolbar-title>

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
      ></v-text-field>

      <v-spacer />
      <v-menu
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
          </v-btn>
        </template>
      </v-menu>

      <div class="d-lg-block d-md-block d-sm-none d-xs-none" style="width: 20px"></div>

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
    </v-app-bar>

    <!-- Main -->
    <v-main>
      <v-container
        fluid
      >
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import jssip from '@/mixins/jssip'
import Vue from 'vue'

export default Vue.extend({
  computed: {
    avatar () {
      const first: string = this.$store.getters['profile/first_name'] || 'N'
      const last: string = this.$store.getters['profile/last_name'] || 'N'
      return first.charAt(0) + last.charAt(0)
    },

    mainMenu () {
      return [
        {
          icon: 'mdi-city',
          list_item: {
            to: {
              name: 'administrator_organizations_list'
            }
          },
          title: 'Organizations',
          visible: this.$permission.isGranted(['section.organization'])
        },
        {
          icon: 'mdi-contacts',
          list_item: {
            to: {
              name: 'administrator_contacts'
            }
          },
          title: 'Contacts',
          visible: this.$permission.isGranted(['section.contacts'])
        },
        {
          icon: 'mdi-account-group',
          list_item: {
            to: {
              name: 'administrator_groups_list'
            }
          },
          title: 'Groups',
          visible: this.$permission.isGranted(['section.groups'])
        },
        {
          icon: 'mdi-account-multiple-outline',
          list_item: {
            to: {
              name: 'administrator_users_list'
            }
          },
          title: 'Users',
          visible: this.$permission.isGranted(['section.users'])
        },
        {
          icon: 'mdi-account-tie',
          list_item: {
            to: {
              name: 'administrator_roles_list'
            }
          },
          title: 'Roles',
          visible: this.$permission.isGranted('role.view')
        },
        {
          icon: 'mdi-projector-screen',
          list_item: {
            to: {
              name: 'administrator_projects_list'
            }
          },
          title: 'Projects',
          visible: this.$permission.isGranted(['section.projects'])
        },
        {
          active: false,
          children: [
            {
              attrs: {
                to: {
                  name: 'administrator_statistics_recent_calls'
                }
              },
              icon: '',
              title: 'Last call statistics',
              visible: true
            },
            {
              attrs: {
                to: {
                  name: 'administrator_statistics_all_calls'
                }
              },
              icon: '',
              title: 'Statistics for all calls',
              visible: true
            },
            {
              attrs: {
                to: {
                  name: 'administrator_statistics_call_count'
                }
              },
              icon: '',
              title: 'By the number of calls',
              visible: true
            },
            {
              attrs: {
                to: {
                  name: 'administrator_statistics_activity'
                }
              },
              icon: '',
              title: 'Employment of employees',
              visible: true
            }
          ],
          icon: 'mdi-chart-arc',
          list_item: {},
          title: 'Statistic',
          visible: this.$permission.isGranted(['section.statistics'])
        },
        { divider: true },
        {
          active: true,
          children: [
            {
              attrs: {
                to: {
                  name: 'administrator_profile'
                }
              },
              icon: 'mdi-account',
              title: 'Profile',
              visible: true
            },
            {
              attrs: {
                to: {
                  name: 'administrator_journal'
                }
              },
              icon: 'mdi-history',
              title: 'Journal',
              visible: true
            },
            {
              attrs: {
                to: {
                  name: 'administrator_security'
                }
              },
              icon: 'mdi-security',
              title: 'Security',
              visible: true
            },
            {
              attrs: {
                to: {
                  name: 'administrator_for_developer'
                }
              },
              icon: 'mdi-flask',
              title: 'For developer',
              visible: this.$store.getters['profile/permissions'].includes('dev_tool.view') || this.$store.getters['profile/is_super_admin']
            },
            {
              attrs: {
                to: {
                  name: 'administrator_settings_regional'
                }
              },
              icon: 'mdi-translate',
              title: 'Regional settings',
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
      get () { return this.$store.getters['settings/navigation_drawer_mini'] },
      set (value: boolean) { this.$store.commit('settings/navigation_drawer_mini', value) }
    }
  },

  data () {
    return {
      accountMenuItems: [
        {
          attrs: {
            dense: true,
            to: {
              name: 'administrator_profile'
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
      }
    }
  },

  mixins: [jssip]
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

</style>

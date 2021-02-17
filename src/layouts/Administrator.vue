<template>
  <v-app id="inspire">

    <!-- Nav drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      class="background--drawer"
      app
      dark
    >
      <v-list-item class="px-2">
        <v-list-item-avatar class="v-icon--link" color="white">
          <v-btn
            icon
            link
            color="primary"
            @click.stop="mini = !mini"
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
                <v-list-item-title>{{ $tc(mainMenuItemChildren.title) }}</v-list-item-title>
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
              <v-list-item-title>{{ $tc(mainMenuItem.title) }}</v-list-item-title>
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
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
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
import Vue from 'vue'
import breadcrumbs from '@/mixins/breadcrumbs'

export default Vue.extend({
  mixins: [breadcrumbs],

  data () {
    return {
      drawer: true,
      items: [
        { title: 'Home', icon: 'mdi-home-city' },
        { title: 'My Account', icon: 'mdi-account' },
        { title: 'Users', icon: 'mdi-account-group-outline' }
      ],
      mini: false,
      settings: {
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: false
      },
      dialog: false,
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
              name: 'administrator_profile'
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
      ]
    }
  },

  computed: {
    avatar () {
      const first: string = this.$store.getters['profile/first_name'] || 'N'
      const last: string = this.$store.getters['profile/last_name'] || 'N'
      return first.charAt(0) + last.charAt(0)
    },

    mainMenu () {
      return [
        {
          title: 'Organizations',
          icon: 'mdi-city',
          visible: this.$permission.isGranted(['section.organization']),
          list_item: {
            to: {
              name: 'administrator_organizations_list'
            }
          }
        },
        {
          title: 'Contacts',
          icon: 'mdi-contacts',
          visible: this.$permission.isGranted(['section.contact']),
          list_item: {
            to: {
              name: 'administrator_contacts'
            }
          }
        },
        {
          title: 'Groups',
          icon: 'mdi-account-group',
          visible: this.$permission.isGranted(['section.groups']),
          list_item: {
            to: {
              name: 'administrator_groups_list'
            }
          }
        },
        {
          title: 'Users',
          icon: 'mdi-account-multiple-outline',
          visible: this.$permission.isGranted(['section.users']),
          list_item: {
            to: {
              name: 'administrator_users_list'
            }
          }
        },
        {
          title: 'Roles',
          icon: 'mdi-account-tie',
          visible: this.$permission.isSuperAdmin(),
          list_item: {
            to: {
              name: 'administrator_roles_list'
            }
          }
        },
        {
          title: 'Projects',
          icon: 'mdi-projector-screen',
          visible: this.$permission.isGranted(['section.projects']),
          list_item: {
            to: {
              name: 'administrator_projects_list'
            }
          }
        },
        {
          title: 'Statistic',
          icon: 'mdi-chart-arc',
          visible: this.$permission.isGranted('section.statistics'),
          list_item: {},
          active: false,
          children: [
            {
              title: 'Last call statistics',
              icon: '',
              visible: true,
              attrs: {
                to: {
                  name: 'administrator_reports_recent_calls'
                }
              }
            },
            {
              title: 'Statistics for all calls',
              icon: '',
              visible: true,
              attrs: {
                to: {
                  name: 'administrator_reports_all_calls'
                }
              }
            }
          ]
        },
        { divider: true },
        {
          title: 'Settings',
          icon: 'mdi-cog-outline',
          active: true,
          visible: true,
          children: [
            {
              title: 'Profile',
              icon: 'mdi-account',
              visible: true,
              attrs: {
                to: {
                  name: 'administrator_profile'
                }
              }
            },
            {
              title: 'Journal',
              icon: 'mdi-history',
              visible: true,
              attrs: {
                to: {
                  name: 'administrator_journal'
                }
              }
            },
            {
              title: 'Security',
              icon: 'mdi-security',
              visible: true,
              attrs: {
                to: {
                  name: 'administrator_security'
                }
              }
            },
            {
              title: 'For developer',
              icon: 'mdi-flask',
              visible: this.$store.getters['profile/permissions'].includes('dev_tool.view') || this.$store.getters['profile/super_admin'],
              attrs: {
                to: {
                  name: 'administrator_for_developer'
                }
              }
            }
          ]
        }
      ]
    }
  }
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

import { loadLanguageAsync } from '@/plugins/i18n'
import Home from '@/views/Home.vue'
import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { NavigationGuardNext } from 'vue-router/types/router'
import roleAdmin from '@/middleware/roleAdmin'
import roleRCC from '@/middleware/roleRCC'
import store from '@/store'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      loadLanguageAsync('ru', 'main').then(() => next())
    },
    meta: {
      layout: 'default',
      title: 'documents',
      middleware: []
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      layout: 'clean',
      breadcrumbs: [],
      middleware: []
    }
  },
  {
    path: '/calls',
    component: () => import(/* webpackChunkName: "calls-layout" */ '../views/Calls/Layout.vue'),
    children: [
      {
        path: '',
        name: 'calls_list',
        component: () => import(/* webpackChunkName: "calls-list" */ '../views/Calls/List.vue'),
        meta: { layout: 'default', middleware: [] }
      }
    ],
    meta: { layout: 'default', middleware: [] }
  },
  {
    path: '/leads',
    component: () => import(/* webpackChunkName: "leads-layout" */ '../views/Leads/Layout.vue'),
    children: [],
    meta: { layout: 'default', middleware: [] }
  },
  {
    path: '/projects',
    component: () => import(/* webpackChunkName: "leads-layout" */ '../views/Projects/Layout.vue'),
    children: [
      {
        path: '',
        name: 'projects_list',
        component: () => import(/* webpackChunkName: "leads-layout" */ '../views/Projects/List.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        }
      }
    ],
    meta: { layout: 'default', middleware: [] }
  },
  {
    path: '/contacts',
    component: () => import(/* webpackChunkName: "contacts-layout" */ '../views/Contacts/Layout.vue'),
    children: [
      {
        path: '',
        name: 'contacts_list',
        component: () => import(/* webpackChunkName: "contacts" */ '../views/Contacts/List.vue'),
        meta: { layout: 'default', middleware: [] }
      },
      {
        path: 'new',
        name: 'contacts_new',
        component: () => import(/* webpackChunkName: "contacts-new" */ '../views/Contacts/New.vue'),
        meta: { layout: 'default', middleware: [] }
      },
      {
        path: ':contact_id',
        name: 'contacts_view',
        component: () => import(/* webpackChunkName: "contacts-view" */ '../views/Contacts/View.vue'),
        children: [
          {
            path: 'script',
            name: 'contacts_script',
            component: () => import(/* webpackChunkName: "contacts-script" */ '../views/Contacts/Script.vue'),
            meta: { layout: 'default', middleware: [] }
          },
          {
            path: 'history',
            name: 'contacts_history',
            component: () => import(/* webpackChunkName: "contacts-history" */ '../views/Contacts/History.vue'),
            meta: { layout: 'default', middleware: [] }
          },
          {
            path: 'tasks',
            name: 'contacts_task',
            component: () => import(/* webpackChunkName: "contacts-task" */ '../views/Contacts/Task.vue'),
            meta: { layout: 'default', middleware: [] }
          }
        ],
        meta: { layout: 'default', middleware: [] }
      }
    ],
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      loadLanguageAsync('ru', 'contacts').then(() => next())
    },
    meta: {
      layout: 'default',
      middleware: []
    }
  },
  {
    path: '/reports',
    component: () => import(/* webpackChunkName: "reports-layout" */ '../views/Reports/Layout.vue'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "reports" */ '../views/Reports/Index.vue'),
        meta: { layout: 'default', middleware: [] }
      }
    ],
    meta: { layout: 'default', middleware: [] }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings/Layout.vue'),
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: () => import(/* webpackChunkName: "settings-profile" */ '../views/Settings/Profile.vue'),
        meta: {
          layout: 'default',
          middleware: []
        }
      },
      {
        path: 'journal',
        name: 'journal',
        component: () => import(/* webpackChunkName: "settings-journal" */ '../views/Settings/Journal.vue'),
        meta: {
          layout: 'default',
          middleware: []
        }
      },
      {
        path: 'security',
        name: 'security',
        component: () => import(/* webpackChunkName: "settings-security" */ '../views/Settings/Security.vue'),
        meta: {
          layout: 'default',
          middleware: []
        }
      },
      {
        path: 'telephony',
        name: 'telephony',
        component: () => import(/* webpackChunkName: "settings-security" */ '../views/Settings/Telephony.vue'),
        meta: {
          layout: 'default',
          middleware: []
        }
      },
      {
        path: 'headset-configure',
        name: 'headset_configure',
        component: () => import(/* webpackChunkName: "settings-headset-configure" */ '../views/Settings/HeadsetConfigure.vue'),
        meta: {
          layout: 'default',
          middleware: []
        }
      }
    ],
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      loadLanguageAsync('ru', 'settings').then(() => next())
    },
    meta: {
      layout: 'default',
      middleware: []
    }
  },
  {
    path: '/help',
    name: 'help',
    component: () => import(/* webpackChunkName: "help" */ '../views/Help/Index.vue'),
    meta: {
      layout: 'default',
      middleware: []
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      layout: 'default',
      title: 'documents',
      middleware: []
    }
  },

  /** Error Pages */
  {
    path: '*',
    name: 'not_found',
    component: () => import(/* webpackChunkName: "not-found" */ '../views/NotFound.vue'),
    meta: {
      layout: 'clean',
      middleware: []
    }
  },
  {
    path: '/access-denied',
    name: 'access_denied',
    component: () => import(/* webpackChunkName: "access-denied" */ '../views/AccessDenied.vue'),
    meta: {
      layout: 'clean',
      middleware: []
    }
  },

  /** Administrator */
  {
    path: '/administrator',
    name: 'administrator',
    component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Layout.vue'),
    children: [
      {
        path: 'organizations',
        component: () => import(/* webpackChunkName: "administrator-organizations" */ '../views/Administrator/Organizations/Layout.vue'),
        children: [
          {
            path: '',
            name: 'administrator_organizations_list',
            component: () => import(/* webpackChunkName: "administrator-organizations-list" */ '../views/Administrator/Organizations/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: 'new',
            name: 'administrator_organizations_new',
            component: () => import(/* webpackChunkName: "administrator-organizations-new" */ '../views/Administrator/Organizations/New.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [roleAdmin]
            },
            beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
              store.dispatch('system/country_codes').finally(next)
            }
          },
          {
            path: ':id',
            name: 'administrator_organizations_edit',
            component: () => import(/* webpackChunkName: "administrator-organizations-edit" */ '../views/Administrator/Organizations/Edit.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [roleAdmin]
            },
            beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
              store.dispatch('system/country_codes').finally(next)
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: [roleAdmin]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'organizations').then(() => next())
        }
      },
      {
        path: 'users',
        component: () => import(/* webpackChunkName: "administrator-users" */ '../views/Administrator/Users/Layout.vue'),
        children: [
          {
            path: '',
            name: 'administrator_users_list',
            component: () => import(/* webpackChunkName: "administrator-users-list" */ '../views/Administrator/Users/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: 'new',
            name: 'administrator_users_new',
            component: () => import(/* webpackChunkName: "administrator-users-new" */ '../views/Administrator/Users/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: ':id',
            name: 'administrator_users_edit',
            component: () => import(/* webpackChunkName: "administrator-users-edit" */ '../views/Administrator/Users/Edit.vue'),
            meta: {
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: [roleAdmin]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'users').then(() => next())
        }
      },
      {
        path: 'groups',
        component: () => import(/* webpackChunkName: "administrator-groups" */ '../views/Administrator/Users/Layout.vue'),
        children: [
          {
            path: '',
            name: 'administrator_groups_list',
            component: () => import(/* webpackChunkName: "administrator-users-list" */ '../views/Administrator/Groups/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: 'new',
            name: 'administrator_groups_new',
            component: () => import(/* webpackChunkName: "administrator-users-new" */ '../views/Administrator/Groups/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: ':id',
            name: 'administrator_groups_edit',
            component: () => import(/* webpackChunkName: "administrator-users-edit" */ '../views/Administrator/Groups/Edit.vue'),
            meta: {
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: [roleAdmin]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'groups').then(() => next())
        }
      },
      {
        path: 'settings',
        name: 'administrator_settings',
        component: () => import(/* webpackChunkName: "administrator-settings" */ '../views/Administrator/Settings/Layout.vue'),
        children: [
          {
            path: 'profile',
            name: 'administrator_profile',
            component: () => import(/* webpackChunkName: "administrator-settings-profile" */ '../views/Administrator/Settings/Profile.vue'),
            meta: {
              icon: 'mdi-account-circle-outline',
              layout: 'administrator',
              middleware: []
            }
          },
          {
            path: 'journal',
            name: 'administrator_journal',
            component: () => import(/* webpackChunkName: "administrator-settings-journal" */ '../views/Administrator/Settings/Journal.vue'),
            meta: {
              icon: 'mdi-history',
              layout: 'administrator',
              middleware: []
            }
          },
          {
            path: 'security',
            name: 'administrator_security',
            component: () => import(/* webpackChunkName: "administrator-settings-security" */ '../views/Administrator/Settings/Security.vue'),
            meta: {
              icon: 'mdi-security',
              layout: 'administrator',
              middleware: []
            }
          },
          {
            path: 'telephony',
            name: 'administrator_telephony',
            component: () => import(/* webpackChunkName: "administrator-settings-security" */ '../views/Administrator/Settings/Telephony.vue'),
            meta: {
              icon: 'mdi-phone-voip',
              layout: 'administrator',
              middleware: []
            }
          },
          {
            path: 'headset-configure',
            name: 'administrator_headset_configure',
            component: () => import(/* webpackChunkName: "administrator-settings-headset-configure" */ '../views/Administrator/Settings/HeadsetConfigure.vue'),
            meta: {
              icon: 'mdi-headset',
              layout: 'administrator',
              middleware: []
            }
          }
        ],
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'settings').then(() => next())
        },
        meta: {
          layout: 'administrator',
          middleware: []
        }
      },
      {
        path: 'projects',
        name: 'administrator_projects',
        component: () => import(/* webpackChunkName: "administrator-projects" */ '../views/Administrator/Projects/Layout.vue'),
        children: [
          {
            path: '',
            component: () => import(/* webpackChunkName: "administrator-projects-list" */ '../views/Administrator/Projects/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: 'new',
            name: 'administrator_projects_new',
            component: () => import(/* webpackChunkName: "administrator-projects-new" */ '../views/Administrator/Projects/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: [roleAdmin]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'projects').then(() => next())
        }
      }
    ],
    meta: {
      layout: 'administrator',
      middleware: [roleAdmin]
    },
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      store.dispatch('system/roles').then()
      loadLanguageAsync('ru', 'administrator').then(() => next())
    }
  },

  /** Call center manager */
  {
    path: '/call-center-manager',
    name: 'call_center_manager',
    component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Layout.vue'),
    children: [
      {
        path: 'reports',
        name: 'call_center_manager_reports',
        component: () => import(/* webpackChunkName: "call-center-manager-reports" */ '../views/CallCenterManage/Reports/Layout.vue'),
        children: [
          {
            path: 'recent-calls',
            name: 'call_center_manager_reports_recent_calls',
            component: () => import(/* webpackChunkName: "call-center-manager-reports-recent-calls" */ '../views/CallCenterManage/Reports/RecentCalls.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: 'all-calls',
            name: 'call_center_manager_reports_all_calls',
            component: () => import(/* webpackChunkName: "call-center-manager-reports-all-calls" */ '../views/CallCenterManage/Reports/AllCalls.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          }
        ],
        meta: {
          layout: 'call-center-manager',
          middleware: [roleRCC]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          next()
        }
      },
      {
        path: 'contacts',
        name: 'call_center_manager_contacts',
        component: () => import(/* webpackChunkName: "call-center-manager-contacts" */ '../views/CallCenterManage/Contacts/Layout.vue'),
        children: [
          {
            path: '',
            component: () => import(/* webpackChunkName: "call-center-manager-contacts" */ '../views/CallCenterManage/Contacts/List.vue'),
            meta: {
              anonymous: true,
              layout: 'call-center-manager',
              middleware: []
            }
          },
          {
            name: 'call_center_manager_contacts_new',
            path: 'new',
            component: () => import(/* webpackChunkName: "call-center-manager-contacts-new" */ '../views/CallCenterManage/Contacts/New.vue'),
            meta: {
              anonymous: true,
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: ':contact_id',
            name: 'contacts_view',
            component: () => import(/* webpackChunkName: "call-center-manager-contacts-view" */ '../views/CallCenterManage/Contacts/View.vue'),
            children: [
              {
                path: 'script',
                name: 'call_center_manager_contacts_view_script',
                component: () => import(/* webpackChunkName: "call-center-manager-contacts-view-script" */ '../views/CallCenterManage/Contacts/Script.vue'),
                meta: { layout: 'call-center-manager', middleware: [] }
              },
              {
                path: 'history',
                name: 'call_center_manager_contacts_view_history',
                component: () => import(/* webpackChunkName: "call-center-manager-contacts-view-history" */ '../views/CallCenterManage/Contacts/History.vue'),
                meta: { layout: 'call-center-manager', middleware: [] }
              },
              {
                path: 'tasks',
                name: 'call_center_manager_contacts_view_task',
                component: () => import(/* webpackChunkName: "call-center-manager-contacts-view-task" */ '../views/CallCenterManage/Contacts/Task.vue'),
                meta: { layout: 'call-center-manager', middleware: [] }
              }
            ],
            meta: { layout: 'call-center-manager', middleware: [] }
          }
        ],
        meta: {
          layout: 'call-center-manager',
          middleware: []
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          next()
        }
      },
      {
        path: 'users',
        name: 'call_center_manager_users',
        component: () => import(/* webpackChunkName: "call-center-manager-users" */ '../views/CallCenterManage/Users/Layout.vue'),
        children: [
          {
            path: '',
            component: () => import(/* webpackChunkName: "call-center-manager-users" */ '../views/CallCenterManage/Users/List.vue'),
            meta: {
              anonymous: true,
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: 'new',
            name: 'call_center_manager_users_new',
            component: () => import(/* webpackChunkName: "call-center-manager-users-new" */ '../views/CallCenterManage/Users/New.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: ':id',
            name: 'call_center_manager_users_edit',
            component: () => import(/* webpackChunkName: "call-center-manager-users-edit" */ '../views/CallCenterManage/Users/Edit.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          }
        ],
        meta: {
          layout: 'call-center-manager',
          middleware: [roleRCC]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          next()
        }
      },
      {
        path: 'groups',
        name: 'call_center_manager_groups',
        component: () => import(/* webpackChunkName: "call-center-manager-groups" */ '../views/CallCenterManage/Groups/Layout.vue'),
        children: [
          {
            path: '',
            component: () => import(/* webpackChunkName: "call-center-manager-group-list" */ '../views/CallCenterManage/Groups/List.vue'),
            meta: {
              anonymous: true,
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: 'new',
            name: 'call_center_manager_group_new',
            component: () => import(/* webpackChunkName: "call-center-manager-group-new" */ '../views/CallCenterManage/Groups/New.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: ':id',
            name: 'call_center_manager_group_edit',
            component: () => import(/* webpackChunkName: "call-center-manager-group-edit" */ '../views/CallCenterManage/Groups/Edit.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          }
        ],
        meta: {
          layout: 'call-center-manager',
          middleware: []
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'groups').then(() => next())
        }
      },
      {
        path: 'settings',
        name: 'call_center_manager_settings',
        component: () => import(/* webpackChunkName: "call-center-manager-settings" */ '../views/CallCenterManage/Settings/Layout.vue'),
        children: [
          {
            path: 'profile',
            name: 'call_center_manager_profile',
            component: () => import(/* webpackChunkName: "call-center-manager-settings-profile" */ '../views/CallCenterManage/Settings/Profile.vue'),
            meta: {
              icon: 'mdi-account-circle-outline',
              layout: 'call-center-manager',
              middleware: []
            }
          },
          {
            path: 'journal',
            name: 'call_center_manager_journal',
            component: () => import(/* webpackChunkName: "call-center-manager-settings-journal" */ '../views/CallCenterManage/Settings/Journal.vue'),
            meta: {
              icon: 'mdi-history',
              layout: 'call-center-manager',
              middleware: []
            }
          },
          {
            path: 'security',
            name: 'call_center_manager_security',
            component: () => import(/* webpackChunkName: "call-center-manager-settings-security" */ '../views/CallCenterManage/Settings/Security.vue'),
            meta: {
              icon: 'mdi-security',
              layout: 'call-center-manager',
              middleware: []
            }
          },
          {
            path: 'developer-settings',
            name: 'call_center_manager_developer_settings',
            component: () => import(/* webpackChunkName: "call-center-manager-settings-developer-settings" */ '../views/CallCenterManage/Settings/DeveloperSettings.vue'),
            meta: {
              icon: 'mdi-flask',
              layout: 'call-center-manager',
              middleware: []
            }
          }
        ],
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'settings').then(() => next())
        },
        meta: {
          layout: 'call-center-manager',
          middleware: []
        }
      }
    ],
    meta: {
      layout: 'call-center-manager',
      middleware: [roleRCC]
    },
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      store.dispatch('system/roles').then()
      loadLanguageAsync('ru', 'call-center-manager').then(() => next())
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export interface MiddlewareContextInterface {
  to: Route;
  from: Route;
  next: NavigationGuardNext;
}

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
  if (to.path === '/') {
    if (store.getters['profile/role_is_leader_cc']) {
      return next({ name: 'call_center_manager' })
    }
    if (store.getters['profile/role_is_admin']) {
      return next({ name: 'administrator' })
    }
  }

  if (!to.meta.middleware) {
    return next()
  }

  if (to.meta.middleware.length === 0) {
    return next()
  }

  const middleware = to.meta.middleware
  const context: MiddlewareContextInterface = {
    to,
    from,
    next
  }
  return middleware[0]({
    ...context
  })
})

export default router

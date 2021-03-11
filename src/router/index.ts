import { loadLanguageAsync } from '@/plugins/i18n'
import { $permission } from '@/plugins/permission'
import Home from '@/views/Home.vue'
import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { NavigationGuardNext } from 'vue-router/types/router'
import secure from '@/middleware/secure'

import { Store } from 'vuex'
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
      middleware: [secure]
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      layout: 'clean',
      breadcrumbs: [],
      middleware: [secure]
    },
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      loadLanguageAsync('ru', 'login').then(() => next())
    }
  },
  {
    path: '/help',
    name: 'help',
    component: () => import(/* webpackChunkName: "help" */ '../views/Operator/Help/Index.vue'),
    meta: {
      layout: 'default',
      middleware: [secure]
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      layout: 'default',
      title: 'documents',
      middleware: [secure]
    }
  },

  /** Error Pages */
  {
    path: '/404',
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
      middleware: [secure]
    }
  },

  /** Operator */
  {
    path: '/operator',
    component: () => import(/* webpackChunkName: "operator-layout" */ '../views/Operator/Layout.vue'),
    children: [
      {
        path: '',
        name: 'operator_home',
        component: () => import(/* webpackChunkName: "operator-home" */ '../views/Operator/Home/Index.vue'),
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: [secure]
        }
      },
      {
        path: 'calls',
        component: () => import(/* webpackChunkName: "calls-layout" */ '../views/Operator/Calls/Layout.vue'),
        children: [
          {
            path: '',
            name: 'operator_calls',
            component: () => import(/* webpackChunkName: "calls-list" */ '../views/Operator/Calls/List.vue'),
            meta: { layout: 'operator-layout', middleware: [secure] }
          }
        ],
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: [secure]
        }
      },
      {
        path: 'leads',
        component: () => import(/* webpackChunkName: "leads-layout" */ '../views/Operator/Leads/Layout.vue'),
        children: [
          {
            path: '',
            name: 'operator_leads',
            component: () => import(/* webpackChunkName: "leads" */ '../views/Operator/Leads/List.vue'),
            meta: {
              layout: 'operator-layout',
              middleware: [secure]
            }
          },
          {
            path: ':contact_id',
            name: 'operator_leads_view',
            component: () => import(/* webpackChunkName: "leads-view" */ '../views/Operator/Leads/View.vue'),
            children: [
              {
                path: 'script',
                name: 'operator_leads_script',
                component: () => import(/* webpackChunkName: "leads-script" */ '../views/Operator/Leads/Script.vue'),
                meta: { layout: 'operator-layout', middleware: [secure] }
              },
              {
                path: 'history',
                name: 'operator_leads_history',
                component: () => import(/* webpackChunkName: "leads-history" */ '../views/Operator/Leads/History.vue'),
                meta: { layout: 'operator-layout', middleware: [secure] }
              },
              {
                path: 'tasks',
                name: 'operator_leads_tasks',
                component: () => import(/* webpackChunkName: "leads-task" */ '../views/Operator/Leads/Task.vue'),
                meta: { layout: 'operator-layout', middleware: [secure] }
              }
            ],
            meta: { layout: 'operator-layout', middleware: [secure] }
          }
        ],
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: [secure]
        }
      },
      {
        path: 'projects',
        component: () => import(/* webpackChunkName: "leads-layout" */ '../views/Operator/Projects/Layout.vue'),
        children: [
          {
            path: '',
            name: 'operator_projects_list',
            component: () => import(/* webpackChunkName: "leads-layout" */ '../views/Operator/Projects/List.vue'),
            meta: {
              anonymous: true,
              layout: 'operator-layout',
              middleware: [secure]
            }
          }
        ],
        meta: { layout: 'operator-layout', middleware: [secure] }
      },
      {
        path: 'contacts',
        component: () => import(/* webpackChunkName: "operator-contacts" */ '../views/Operator/Contacts/Layout.vue'),
        children: [
          {
            path: '',
            name: 'operator_contacts_list',
            component: () => import(/* webpackChunkName: "operator-contacts" */ '../views/Operator/Contacts/List.vue'),
            meta: {
              layout: 'operator-layout',
              middleware: [secure]
            }
          },
          {
            path: 'new',
            name: 'operator_contacts_new',
            component: () => import(/* webpackChunkName: "operator-contacts-new" */ '../views/Operator/Contacts/New.vue'),
            meta: { layout: 'operator-layout', middleware: [secure] },
            beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
              next()
              store.dispatch('system/country_codes')
            }
          },
          {
            path: ':contact_id/edit',
            name: 'operator_contacts_edit',
            component: () => import(/* webpackChunkName: "operator-contacts-edit" */ '../views/Operator/Contacts/Edit.vue'),
            meta: { layout: 'operator-layout', middleware: [secure] },
            beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
              next()
              store.dispatch('system/country_codes')
            }
          },
          {
            path: ':contact_id',
            name: 'operator_contacts_view',
            component: () => import(/* webpackChunkName: "operator-contacts-view" */ '../views/Operator/Contacts/View.vue'),
            children: [
              {
                // todo: Deprecated (нет нужды в данном решении)
                path: 'script',
                name: 'operator_contacts_view_script',
                component: () => import(/* webpackChunkName: "operator-contacts-view-script" */ '../views/Operator/Contacts/Script.vue'),
                meta: { layout: 'operator-layout', middleware: [secure] }
              },
              {
                path: 'history',
                name: 'operator_contacts_view_history',
                component: () => import(/* webpackChunkName: "operator-contacts-view-history" */ '../views/Operator/Contacts/History.vue'),
                meta: { layout: 'operator-layout', middleware: [secure] }
              },
              {
                path: 'tasks',
                name: 'operator_contacts_view_tasks',
                component: () => import(/* webpackChunkName: "operator-contacts-view-tasks" */ '../views/Operator/Contacts/Task.vue'),
                meta: { layout: 'operator-layout', middleware: [secure] }
              }
            ],
            meta: { layout: 'operator-layout', middleware: [secure] }
          }
        ],
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'contacts').then(() => next())
        },
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: [secure]
        }
      },
      {
        path: 'reports',
        component: () => import(/* webpackChunkName: "operator-reports" */ '../views/Operator/Reports/Layout.vue'),
        children: [
          {
            path: 'recent-calls',
            name: 'operator_reports_recent_calls',
            component: () => import(/* webpackChunkName: "operator-reports-recent-calls" */ '../views/Operator/Reports/RecentCalls.vue'),
            meta: {
              layout: 'operator-layout',
              middleware: [secure]
            }
          },
          {
            path: 'all-calls',
            name: 'operator_reports_all_calls',
            component: () => import(/* webpackChunkName: "operator-reports-all-calls" */ '../views/Operator/Reports/AllCalls.vue'),
            meta: {
              layout: 'operator-layout',
              middleware: [secure]
            }
          }
        ],
        meta: {
          layout: 'operator-layout',
          middleware: [secure]
        }
      },
      {
        path: 'settings',
        component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Layout.vue'),
        children: [
          {
            path: 'profile',
            name: 'operator_settings_profile',
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Profile.vue'),
            meta: {
              icon: 'mdi-account-circle-outline',
              layout: 'operator-layout',
              middleware: [secure]
            }
          },
          {
            path: 'journal',
            name: 'operator_settings_journal',
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Journal.vue'),
            meta: {
              icon: 'mdi-history',
              layout: 'operator-layout',
              middleware: [secure]
            }
          },
          {
            path: 'security',
            name: 'operator_settings_security',
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Security.vue'),
            meta: {
              icon: 'mdi-security',
              layout: 'operator-layout',
              middleware: [secure]
            }
          },
          {
            path: 'telephony',
            name: 'operator_settings_telephony',
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Telephony.vue'),
            meta: {
              icon: 'mdi-webrtc',
              layout: 'operator-layout',
              middleware: [secure]
            }
          },
          {
            path: 'headset-configure',
            name: 'operator_settings_headset_configure',
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/HeadsetConfigure.vue'),
            meta: {
              icon: 'mdi-headset',
              layout: 'operator-layout',
              middleware: [secure]
            }
          }
        ],
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'settings').then(() => next())
        },
        meta: {
          layout: 'operator-layout',
          middleware: [secure]
        }
      },
      {
        path: 'help',
        name: 'operator_help',
        component: () => import(/* webpackChunkName: "operator-help" */ '../views/Operator/Help/Index.vue'),
        meta: {
          layout: 'operator-layout',
          middleware: [secure]
        }
      }
    ],
    meta: {
      anonymous: true,
      layout: 'operator-layout',
      middleware: [secure]
    },
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      store.dispatch('system/roles').then()
      loadLanguageAsync('ru', 'operator').then(() => next())
    }
  },

  /** Administrator */
  {
    path: '/administrator',
    component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Layout.vue'),
    children: [
      {
        path: '',
        name: 'administrator',
        component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Home.vue'),
        meta: {
          layout: 'administrator',
          middleware: [secure]
        }
      },
      {
        path: 'organizations',
        component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Organizations/Layout.vue'),
        children: [
          {
            path: '',
            name: 'administrator_organizations_list',
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Organizations/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: 'new',
            name: 'administrator_organizations_new',
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Organizations/New.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
              store.dispatch('system/country_codes').finally(next)
            }
          },
          {
            path: ':id',
            name: 'administrator_organizations_edit',
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Organizations/Edit.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
              store.dispatch('system/country_codes').finally(next)
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.organization'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        }
      },
      {
        path: 'roles',
        component: () => import(/* webpackChunkName: "administrator-roles" */ '../views/Administrator/Roles/Layout.vue'),
        children: [
          {
            path: '',
            name: 'administrator_roles_list',
            component: () => import(/* webpackChunkName: "administrator-roles-list" */ '../views/Administrator/Roles/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: ':id',
            name: 'administrator_roles_edit',
            component: () => import(/* webpackChunkName: "administrator-roles-edit" */ '../views/Administrator/Roles/Edit.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted('role.view')) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        }
      },
      {
        path: 'contacts',
        component: () => import(/* webpackChunkName: "administrator-contacts" */ '../views/Administrator/Contacts/Layout.vue'),
        children: [
          {
            path: '',
            name: 'administrator_contacts',
            component: () => import(/* webpackChunkName: "administrator-contacts" */ '../views/Administrator/Contacts/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            name: 'administrator_contacts_new',
            path: 'new',
            component: () => import(/* webpackChunkName: "administrator-contacts" */ '../views/Administrator/Contacts/New.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            name: 'administrator_contacts_edit',
            path: ':contact_id',
            component: () => import(/* webpackChunkName: "administrator-contacts" */ '../views/Administrator/Contacts/Edit.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            name: 'administrator_contacts_history',
            path: ':contact_id/history',
            component: () => import(/* webpackChunkName: "administrator-contacts-history" */ '../views/Administrator/Contacts/History.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: ':contact_id',
            name: 'administrator_contacts_view',
            component: () => import(/* webpackChunkName: "administrator-contacts-view" */ '../views/Administrator/Contacts/View.vue'),
            children: [
              {
                path: 'script',
                name: 'administrator_contacts_view_script',
                component: () => import(/* webpackChunkName: "administrator-contacts-view" */ '../views/Administrator/Contacts/Script.vue'),
                meta: { layout: 'administrator', middleware: [secure] }
              },
              {
                path: 'history',
                name: 'administrator_contacts_view_history',
                component: () => import(/* webpackChunkName: "administrator-contacts-view" */ '../views/Administrator/Contacts/History.vue'),
                meta: { layout: 'administrator', middleware: [secure] }
              },
              {
                path: 'tasks',
                name: 'administrator_contacts_view_task',
                component: () => import(/* webpackChunkName: "administrator-contacts-view" */ '../views/Administrator/Contacts/Task.vue'),
                meta: { layout: 'administrator', middleware: [secure] }
              }
            ],
            meta: { layout: 'administrator', middleware: [secure] }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.contacts'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        }
      },
      {
        path: 'users',
        component: () => import(/* webpackChunkName: "administrator-users-list" */ '../views/Administrator/Users/Layout.vue'),
        children: [
          {
            path: '',
            name: 'administrator_users_list',
            component: () => import(/* webpackChunkName: "administrator-users-list" */ '../views/Administrator/Users/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: 'new',
            component: () => import(/* webpackChunkName: "administrator-users-list" */ '../views/Administrator/Users/New/Tabs.vue'),
            children: [
              {
                path: '',
                name: 'administrator_users_new_main',
                component: () => import(/* webpackChunkName: "administrator-users-list" */ '../views/Administrator/Users/New/Main.vue'),
                meta: { layout: 'administrator', middleware: [secure] }
              }
            ],
            meta: {
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: ':user_id',
            component: () => import(/* webpackChunkName: "administrator-users-edit" */ '../views/Administrator/Users/Edit/Tabs.vue'),
            children: [
              {
                path: '',
                name: 'administrator_users_edit_main',
                component: () => import(/* webpackChunkName: "administrator-users-edit" */ '../views/Administrator/Users/Edit/Main.vue'),
                meta: { layout: 'administrator', middleware: [secure] }
              },
              {
                path: 'telephony',
                name: 'administrator_users_edit_telephony',
                component: () => import(/* webpackChunkName: "administrator-users-edit" */ '../views/Administrator/Users/Edit/Telephony.vue'),
                meta: { layout: 'administrator', middleware: [secure] }
              }
            ],
            meta: {
              layout: 'administrator',
              middleware: [secure]
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.users'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        }
      },
      {
        path: 'groups',
        component: () => import(/* webpackChunkName: "administrator-groups-list" */ '../views/Administrator/Users/Layout.vue'),
        children: [
          {
            path: '',
            name: 'administrator_groups_list',
            component: () => import(/* webpackChunkName: "administrator-groups-list" */ '../views/Administrator/Groups/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: 'new',
            name: 'administrator_groups_new',
            component: () => import(/* webpackChunkName: "administrator-groups-new" */ '../views/Administrator/Groups/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: ':id',
            name: 'administrator_groups_edit',
            component: () => import(/* webpackChunkName: "administrator-groups-new" */ '../views/Administrator/Groups/Edit.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.groups'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
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
              middleware: [secure]
            }
          },
          {
            path: 'journal',
            name: 'administrator_journal',
            component: () => import(/* webpackChunkName: "administrator-settings-journal" */ '../views/Administrator/Settings/Journal.vue'),
            meta: {
              icon: 'mdi-history',
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: 'security',
            name: 'administrator_security',
            component: () => import(/* webpackChunkName: "administrator-settings-security" */ '../views/Administrator/Settings/Security.vue'),
            meta: {
              icon: 'mdi-security',
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: 'development',
            name: 'administrator_for_developer',
            component: () => import(/* webpackChunkName: "administrator-settings-for-developer" */ '../views/Administrator/Settings/DeveloperSettings.vue'),
            meta: {
              icon: 'mdi-flask',
              layout: 'administrator',
              middleware: [secure]
            }
          }
        ],
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'settings').then(() => next())
        },
        meta: {
          layout: 'administrator',
          middleware: [secure]
        }
      },
      {
        path: 'projects',
        component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Projects/Layout.vue'),
        children: [
          {
            path: '',
            name: 'administrator_projects_list',
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Projects/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: 'new',
            name: 'administrator_projects_new',
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Projects/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: ':project_id',
            name: 'administrator_projects_edit',
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Projects/Edit.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.projects'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        }
      },
      {
        path: 'reports',
        name: 'administrator_reports',
        component: () => import(/* webpackChunkName: "administrator-reports" */ '../views/Administrator/Reports/Layout.vue'),
        children: [
          {
            path: 'recent-calls',
            name: 'administrator_reports_recent_calls',
            component: () => import(/* webpackChunkName: "administrator-reports-recent-calls" */ '../views/Administrator/Reports/RecentCalls.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            }
          },
          {
            path: 'all-calls',
            name: 'administrator_reports_all_calls',
            component: () => import(/* webpackChunkName: "administrator-all-calls" */ '../views/Administrator/Reports/AllCalls.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.statistics'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        }
      }
    ],
    meta: {
      layout: 'administrator',
      anonymous: true,
      middleware: [secure]
    },
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      store.dispatch('system/roles').then()
      loadLanguageAsync('ru', 'administrator').then(() => next())
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
  store: Store<any>
}

// const timer = new Timer()

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
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
    next,
    store
  }
  return middleware[0]({
    ...context
  })
})

// router.afterEach((to, from) => {
//   timer.stop()
//
//   if (to.name !== from.name) {
//     if (timer.diff() < 800) {
//       setTimeout(() => {
//         app.$root.$emit('root-loading-data-hide')
//       }, 800)
//     } else {
//       app.$root.$emit('root-loading-data-hide')
//     }
//   }
// })

export default router

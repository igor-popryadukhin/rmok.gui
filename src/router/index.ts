import { app } from '@/main'
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
    component: Home,
    meta: {
      layout: 'default',
      middleware: [secure],
      title: 'documents'
    },
    name: 'home',
    path: '/'
  },
  {
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      breadcrumbs: [],
      layout: 'clean',
      middleware: [secure]
    },
    name: 'login',
    path: '/login'
  },
  {
    component: () => import(/* webpackChunkName: "help" */ '../views/Operator/Help/Index.vue'),
    meta: {
      layout: 'default',
      middleware: [secure]
    },
    name: 'help',
    path: '/help'
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      layout: 'default',
      middleware: [secure],
      title: 'documents'
    },
    name: 'About',
    path: '/about'
  },

  /** Error Pages */
  {
    component: () => import(/* webpackChunkName: "not-found" */ '../views/NotFound.vue'),
    meta: {
      layout: 'clean',
      middleware: []
    },
    name: 'not_found',
    path: '/404'
  },
  {
    component: () => import(/* webpackChunkName: "access-denied" */ '../views/AccessDenied.vue'),
    meta: {
      layout: 'clean',
      middleware: [secure]
    },
    name: 'access_denied',
    path: '/access-denied'
  },

  /** Operator */
  {
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      store.dispatch('system/roles').then()
      loadLanguageAsync('ru', 'main').finally(() => next())
    },
    children: [
      {
        component: () => import(/* webpackChunkName: "operator-home" */ '../views/Operator/Home/Index.vue'),
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: [secure]
        },
        name: 'operator_home',
        path: ''
      },
      {
        children: [
          {
            component: () => import(/* webpackChunkName: "calls-list" */ '../views/Operator/Calls/List.vue'),
            meta: { layout: 'operator-layout', middleware: [secure] },
            name: 'operator_calls',
            path: ''
          }
        ],
        component: () => import(/* webpackChunkName: "calls-layout" */ '../views/Operator/Calls/Layout.vue'),
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: [secure]
        },
        path: 'calls'
      },
      {
        children: [
          {
            component: () => import(/* webpackChunkName: "operator-tasks-list" */ '../views/Operator/Tasks/List.vue'),
            meta: { layout: 'operator-layout', middleware: [secure] },
            name: 'operator_tasks_list',
            path: ''
          }
        ],
        component: () => import(/* webpackChunkName: "operator-tasks-layout" */ '../views/Operator/Tasks/Layout.vue'),
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: [secure]
        },
        path: 'tasks'
      },
      {
        children: [
          {
            component: () => import(/* webpackChunkName: "leads" */ '../views/Operator/Leads/List.vue'),
            meta: {
              layout: 'operator-layout',
              middleware: [secure]
            },
            name: 'operator_leads',
            path: ''
          },
          {
            children: [
              // {
              //   path: 'script',
              //   name: 'operator_leads_script',
              //   component: () => import(/* webpackChunkName: "leads-script" */ '../views/Operator/Contacts/Script.vue'),
              //   meta: { layout: 'operator-layout', middleware: [secure] }
              // },
              // {
              //   path: 'history',
              //   name: 'operator_leads_history',
              //   component: () => import(/* webpackChunkName: "leads-history" */ '../views/Operator/Contacts/History.vue'),
              //   meta: { layout: 'operator-layout', middleware: [secure] }
              // },
              // {
              //   path: 'tasks',
              //   name: 'operator_leads_tasks',
              //   component: () => import(/* webpackChunkName: "leads-task" */ '../views/Operator/Contacts/Task.vue'),
              //   meta: { layout: 'operator-layout', middleware: [secure] }
              // }
            ],
            component: () => import(/* webpackChunkName: "leads-view" */ '../views/Operator/Contacts/View.vue'),
            meta: { layout: 'operator-layout', middleware: [secure] },
            name: 'operator_leads_view',
            path: ':contact_id'
          }
        ],
        component: () => import(/* webpackChunkName: "leads-layout" */ '../views/Operator/Leads/Layout.vue'),
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: [secure]
        },
        path: 'leads'
      },
      {
        children: [
          {
            component: () => import(/* webpackChunkName: "leads-layout" */ '../views/Operator/Projects/List.vue'),
            meta: {
              anonymous: true,
              layout: 'operator-layout',
              middleware: [secure]
            },
            name: 'operator_projects_list',
            path: ''
          }
        ],
        component: () => import(/* webpackChunkName: "leads-layout" */ '../views/Operator/Projects/Layout.vue'),
        meta: { layout: 'operator-layout', middleware: [secure] },
        path: 'projects'
      },
      {
        children: [
          {
            component: () => import(/* webpackChunkName: "operator-contacts" */ '../views/Operator/Contacts/List.vue'),
            meta: {
              layout: 'operator-layout',
              middleware: [secure]
            },
            name: 'operator_contacts_list',
            path: ''
          },
          {
            beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
              next()
              store.dispatch('system/country_codes')
            },
            component: () => import(/* webpackChunkName: "operator-contacts-new" */ '../views/Operator/Contacts/New.vue'),
            meta: { layout: 'operator-layout', middleware: [secure] },
            name: 'operator_contacts_new',
            path: 'new'
          },
          {
            beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
              next()
              store.dispatch('system/country_codes')
            },
            component: () => import(/* webpackChunkName: "operator-contacts-edit" */ '../views/Operator/Contacts/Edit.vue'),
            meta: { layout: 'operator-layout', middleware: [secure] },
            name: 'operator_contacts_edit',
            path: ':contact_id/edit'
          },
          {
            children: [
              // {
              //   // todo: Deprecated (нет нужды в данном решении)
              //   path: 'script',
              //   name: 'operator_contacts_view',
              //   component: () => import(/* webpackChunkName: "operator-contacts-view-script" */ '../views/Operator/Contacts/Script.vue'),
              //   meta: { layout: 'operator-layout', middleware: [secure] }
              // },
              // {
              //   path: 'history',
              //   name: 'operator_contacts_view_history',
              //   component: () => import(/* webpackChunkName: "operator-contacts-view-history" */ '../views/Operator/Contacts/History.vue'),
              //   meta: { layout: 'operator-layout', middleware: [secure] }
              // },
              // {
              //   path: 'tasks',
              //   name: 'operator_contacts_view_tasks',
              //   component: () => import(/* webpackChunkName: "operator-contacts-view-tasks" */ '../views/Operator/Contacts/Task.vue'),
              //   meta: { layout: 'operator-layout', middleware: [secure] }
              // }
            ],
            component: () => import(/* webpackChunkName: "operator-contacts-view" */ '../views/Operator/Contacts/View.vue'),
            meta: { layout: 'operator-layout', middleware: [secure] },
            name: 'operator_contacts_view',
            path: ':contact_id'
          }
        ],
        component: () => import(/* webpackChunkName: "operator-contacts" */ '../views/Operator/Contacts/Layout.vue'),
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: [secure]
        },
        path: 'contacts'
      },
      {
        children: [
          {
            component: () => import(/* webpackChunkName: "operator-reports-recent-calls" */ '../views/Operator/Reports/RecentCalls.vue'),
            meta: {
              layout: 'operator-layout',
              middleware: [secure]
            },
            name: 'operator_reports_recent_calls',
            path: 'recent-calls'
          },
          {
            component: () => import(/* webpackChunkName: "operator-reports-all-calls" */ '../views/Operator/Reports/AllCalls.vue'),
            meta: {
              layout: 'operator-layout',
              middleware: [secure]
            },
            name: 'operator_reports_all_calls',
            path: 'all-calls'
          }
        ],
        component: () => import(/* webpackChunkName: "operator-reports" */ '../views/Operator/Reports/Layout.vue'),
        meta: {
          layout: 'operator-layout',
          middleware: [secure]
        },
        path: 'reports'
      },
      {
        children: [
          {
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Profile.vue'),
            meta: {
              icon: 'mdi-account-circle-outline',
              layout: 'operator-layout',
              middleware: [secure]
            },
            name: 'operator_settings_profile',
            path: 'profile'
          },
          {
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Journal.vue'),
            meta: {
              icon: 'mdi-history',
              layout: 'operator-layout',
              middleware: [secure]
            },
            name: 'operator_settings_journal',
            path: 'journal'
          },
          {
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Security.vue'),
            meta: {
              icon: 'mdi-security',
              layout: 'operator-layout',
              middleware: [secure]
            },
            name: 'operator_settings_security',
            path: 'security'
          },
          {
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Telephony.vue'),
            meta: {
              icon: 'mdi-webrtc',
              layout: 'operator-layout',
              middleware: [secure]
            },
            name: 'operator_settings_telephony',
            path: 'telephony'
          },
          {
            component: () => import(/* webpackChunkName: "operator-settings-regional" */ '../views/Operator/Settings/Regional.vue'),
            meta: {
              icon: 'mdi-translate',
              layout: 'operator-layout',
              middleware: [secure]
            },
            name: 'operator_settings_regional',
            path: 'regional'
          },
          {
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/HeadsetConfigure.vue'),
            meta: {
              icon: 'mdi-headset',
              layout: 'operator-layout',
              middleware: [secure]
            },
            name: 'operator_settings_headset_configure',
            path: 'headset-configure'
          }
        ],
        component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Layout.vue'),
        meta: {
          layout: 'operator-layout',
          middleware: [secure]
        },
        path: 'settings'
      },
      {
        component: () => import(/* webpackChunkName: "operator-help" */ '../views/Operator/Help/Index.vue'),
        meta: {
          layout: 'operator-layout',
          middleware: [secure]
        },
        name: 'operator_help',
        path: 'help'
      }
    ],
    component: () => import(/* webpackChunkName: "operator-layout" */ '../views/Operator/Layout.vue'),
    meta: {
      anonymous: true,
      layout: 'operator-layout',
      middleware: [secure]
    },
    path: '/operator'
  },

  /** Administrator */
  {
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      store.dispatch('system/roles').then()
      loadLanguageAsync('ru', 'main').finally(() => next())
    },
    children: [
      {
        component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Home.vue'),
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        name: 'administrator',
        path: ''
      },
      {
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.organization'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        },
        children: [
          {
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Organizations/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_organizations_list',
            path: ''
          },
          {
            beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
              store.dispatch('system/country_codes').finally(next)
            },
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Organizations/New.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_organizations_new',
            path: 'new'
          },
          {
            beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
              store.dispatch('system/country_codes').finally(next)
            },
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Organizations/Edit.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_organizations_edit',
            path: ':id'
          }
        ],
        component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Organizations/Layout.vue'),
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        path: 'organizations'
      },
      {
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted('role.view')) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        },
        children: [
          {
            component: () => import(/* webpackChunkName: "administrator-roles-list" */ '../views/Administrator/Roles/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_roles_list',
            path: ''
          },
          {
            component: () => import(/* webpackChunkName: "administrator-roles-edit" */ '../views/Administrator/Roles/Edit.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_roles_edit',
            path: ':id'
          }
        ],
        component: () => import(/* webpackChunkName: "administrator-roles" */ '../views/Administrator/Roles/Layout.vue'),
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        path: 'roles'
      },
      {
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.contacts'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        },
        children: [
          {
            component: () => import(/* webpackChunkName: "administrator-contacts" */ '../views/Administrator/Contacts/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_contacts',
            path: ''
          },
          {
            component: () => import(/* webpackChunkName: "administrator-contacts" */ '../views/Administrator/Contacts/New.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_contacts_new',
            path: 'new'
          },
          {
            component: () => import(/* webpackChunkName: "administrator-contacts" */ '../views/Administrator/Contacts/Edit.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_contacts_edit',
            path: ':contact_id/edit'
          },
          {
            component: () => import(/* webpackChunkName: "administrator-contacts-history" */ '../views/Administrator/Contacts/History.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_contacts_history',
            path: ':contact_id/history'
          },
          {
            beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
              // Проинициализируем WebRTC
              app.$root.$emit('root-jssip-initialize')
              next()
            },
            children: [],
            component: () => import(/* webpackChunkName: "administrator-contacts-view" */ '../views/Operator/Contacts/View.vue'),
            meta: { layout: 'administrator', middleware: [secure] },
            name: 'administrator_contacts_view',
            path: ':contact_id'
          }
        ],
        component: () => import(/* webpackChunkName: "administrator-contacts" */ '../views/Administrator/Contacts/Layout.vue'),
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        path: 'contacts'
      },
      {
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.users'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        },
        children: [
          {
            component: () => import(/* webpackChunkName: "administrator-users-list" */ '../views/Administrator/Users/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_users_list',
            path: ''
          },
          {
            children: [
              {
                component: () => import(/* webpackChunkName: "administrator-users-list" */ '../views/Administrator/Users/New/Main.vue'),
                meta: { layout: 'administrator', middleware: [secure] },
                name: 'administrator_users_new_main',
                path: ''
              }
            ],
            component: () => import(/* webpackChunkName: "administrator-users-list" */ '../views/Administrator/Users/New/Tabs.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            path: 'new'
          },
          {
            children: [
              {
                component: () => import(/* webpackChunkName: "administrator-users-edit" */ '../views/Administrator/Users/Edit/Main.vue'),
                meta: { layout: 'administrator', middleware: [secure] },
                name: 'administrator_users_edit_main',
                path: ''
              },
              {
                component: () => import(/* webpackChunkName: "administrator-users-edit" */ '../views/Administrator/Users/Edit/Telephony.vue'),
                meta: { layout: 'administrator', middleware: [secure] },
                name: 'administrator_users_edit_telephony',
                path: 'telephony'
              }
            ],
            component: () => import(/* webpackChunkName: "administrator-users-edit" */ '../views/Administrator/Users/Edit/Tabs.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            path: ':user_id'
          }
        ],
        component: () => import(/* webpackChunkName: "administrator-users-list" */ '../views/Administrator/Users/Layout.vue'),
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        path: 'users'
      },
      {
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.groups'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        },
        children: [
          {
            component: () => import(/* webpackChunkName: "administrator-groups-list" */ '../views/Administrator/Groups/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_groups_list',
            path: ''
          },
          {
            component: () => import(/* webpackChunkName: "administrator-groups-new" */ '../views/Administrator/Groups/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_groups_new',
            path: 'new'
          },
          {
            component: () => import(/* webpackChunkName: "administrator-groups-new" */ '../views/Administrator/Groups/Edit.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_groups_edit',
            path: ':id'
          }
        ],
        component: () => import(/* webpackChunkName: "administrator-groups-list" */ '../views/Administrator/Users/Layout.vue'),
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        path: 'groups'
      },
      {
        children: [
          {
            component: () => import(/* webpackChunkName: "administrator-settings-profile" */ '../views/Administrator/Settings/Profile.vue'),
            meta: {
              icon: 'mdi-account-circle-outline',
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_profile',
            path: 'profile'
          },
          {
            component: () => import(/* webpackChunkName: "administrator-settings-journal" */ '../views/Administrator/Settings/Journal.vue'),
            meta: {
              icon: 'mdi-history',
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_journal',
            path: 'journal'
          },
          {
            component: () => import(/* webpackChunkName: "administrator-settings-security" */ '../views/Administrator/Settings/Security.vue'),
            meta: {
              icon: 'mdi-security',
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_security',
            path: 'security'
          },
          {
            component: () => import(/* webpackChunkName: "administrator-settings-for-developer" */ '../views/Administrator/Settings/DeveloperSettings.vue'),
            meta: {
              icon: 'mdi-flask',
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_for_developer',
            path: 'development'
          }
        ],
        component: () => import(/* webpackChunkName: "administrator-settings" */ '../views/Administrator/Settings/Layout.vue'),
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        name: 'administrator_settings',
        path: 'settings'
      },
      {
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.projects'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        },
        children: [
          {
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Projects/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_projects_list',
            path: ''
          },
          {
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Projects/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_projects_new',
            path: 'new'
          },
          {
            component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Projects/Edit.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_projects_edit',
            path: ':project_id'
          }
        ],
        component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Projects/Layout.vue'),
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        path: 'projects'
      },
      {
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          if ($permission.isGranted(['section.statistics'])) {
            next()
          } else {
            next({ name: 'access_denied' })
          }
        },
        children: [
          {
            component: () => import(/* webpackChunkName: "administrator-reports-recent-calls" */ '../views/Administrator/Reports/RecentCalls.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_reports_recent_calls',
            path: 'recent-calls'
          },
          {
            component: () => import(/* webpackChunkName: "administrator-reports-all-calls" */ '../views/Administrator/Reports/AllCalls.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_reports_all_calls',
            path: 'all-calls'
          },
          {
            component: () => import(/* webpackChunkName: "administrator-reports-call-count" */ '../views/Administrator/Reports/CallCount.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_reports_call_count',
            path: 'call-count'
          },
          {
            component: () => import(/* webpackChunkName: "administrator-reports-activity" */ '../views/Administrator/Reports/Activity.vue'),
            meta: {
              layout: 'administrator',
              middleware: [secure]
            },
            name: 'administrator_reports_activity',
            path: 'activity'
          }
        ],
        component: () => import(/* webpackChunkName: "administrator-reports" */ '../views/Administrator/Reports/Layout.vue'),
        meta: {
          layout: 'administrator',
          middleware: [secure]
        },
        name: 'administrator_reports',
        path: 'reports'
      }
    ],
    component: () => import(/* webpackChunkName: "administrator" */ '../views/Administrator/Layout.vue'),
    meta: {
      anonymous: true,
      layout: 'administrator',
      middleware: [secure]
    },
    path: '/administrator'
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
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
  if (to.path === '/') {
    if (store.getters['profile/role_use'] === 'for_administration') {
      next('/administrator')
    } else if (store.getters['profile/role_use'] === 'for_calls') {
      next('/operator')
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
    from,
    next,
    store,
    to
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

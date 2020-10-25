import { loadLanguageAsync } from '@/plugins/i18n'
import Home from '@/views/Home.vue'
import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { NavigationGuardNext } from 'vue-router/types/router'
import role from '@/middleware/role'
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
        path: ':id/view',
        name: 'contacts_view',
        component: () => import(/* webpackChunkName: "contacts-view" */ '../views/Contacts/View.vue'),
        meta: { layout: 'default', middleware: [] }
      },
      {
        path: ':id/edit',
        name: 'contacts_edit',
        component: () => import(/* webpackChunkName: "contacts-edit" */ '../views/Contacts/Edit.vue'),
        meta: { layout: 'default', middleware: [] }
      },
      {
        path: ':contact_id/history',
        name: 'contacts_history',
        component: () => import(/* webpackChunkName: "contacts-history" */ '../views/Contacts/History.vue'),
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
      layout: 'default',
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
              middleware: []
            }
          },
          {
            path: 'new',
            name: 'administrator_organizations_new',
            component: () => import(/* webpackChunkName: "administrator-organizations-new" */ '../views/Administrator/Organizations/New.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: []
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: []
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
              middleware: []
            }
          },
          {
            path: 'new',
            name: 'administrator_users_new',
            component: () => import(/* webpackChunkName: "administrator-users-new" */ '../views/Administrator/Users/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: []
            }
          },
          {
            path: ':id',
            name: 'administrator_users_edit',
            component: () => import(/* webpackChunkName: "administrator-users-edit" */ '../views/Administrator/Users/Edit.vue'),
            meta: {
              layout: 'administrator',
              middleware: []
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: []
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
              middleware: []
            }
          },
          {
            path: 'new',
            name: 'administrator_groups_new',
            component: () => import(/* webpackChunkName: "administrator-users-new" */ '../views/Administrator/Groups/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: []
            }
          },
          {
            path: ':id',
            name: 'administrator_groups_edit',
            component: () => import(/* webpackChunkName: "administrator-users-edit" */ '../views/Administrator/Groups/Edit.vue'),
            meta: {
              layout: 'administrator',
              middleware: []
            }
          }
        ],
        meta: {
          layout: 'administrator',
          middleware: []
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'groups').then(() => next())
        }
      },
      {
        path: 'settings',
        name: 'administrator_settings',
        component: () => import(/* webpackChunkName: "administrator-settings" */ '../views/Settings/Layout.vue'),
        children: [
          {
            path: 'profile',
            name: 'administrator_profile',
            component: () => import(/* webpackChunkName: "administrator-settings-profile" */ '../views/Settings/Profile.vue'),
            meta: {
              layout: 'default',
              middleware: []
            }
          },
          {
            path: 'journal',
            name: 'administrator_journal',
            component: () => import(/* webpackChunkName: "administrator-settings-journal" */ '../views/Settings/Journal.vue'),
            meta: {
              layout: 'default',
              middleware: []
            }
          },
          {
            path: 'security',
            name: 'administrator_security',
            component: () => import(/* webpackChunkName: "administrator-settings-security" */ '../views/Settings/Security.vue'),
            meta: {
              layout: 'default',
              middleware: []
            }
          },
          {
            path: 'telephony',
            name: 'administrator_telephony',
            component: () => import(/* webpackChunkName: "administrator-settings-security" */ '../views/Settings/Telephony.vue'),
            meta: {
              layout: 'default',
              middleware: []
            }
          },
          {
            path: 'headset-configure',
            name: 'administrator_headset_configure',
            component: () => import(/* webpackChunkName: "administrator-settings-headset-configure" */ '../views/Settings/HeadsetConfigure.vue'),
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
      }
    ],
    meta: {
      layout: 'administrator',
      middleware: [role]
    },
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      store.dispatch('system/roles').then()
      store.dispatch('system/groups').then()
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
}

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
    next
  }
  return middleware[0]({
    ...context
  })
})

export default router

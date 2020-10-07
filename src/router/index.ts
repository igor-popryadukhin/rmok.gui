import { loadLanguageAsync } from '@/plugins/i18n'
import Home from '@/views/Home.vue'
import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { NavigationGuardNext } from 'vue-router/types/router'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
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
  {
    path: '*',
    name: 'not_found',
    component: () => import(/* webpackChunkName: "not-found" */ '../views/NotFound.vue'),
    meta: {
      layout: 'default',
      middleware: []
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
  if (!to.meta.middleware) {
    return next()
  }

  if (to.meta.middleware.length === 0) {
    return next()
  }

  const middleware = to.meta.middleware
  const context = {
    to,
    from,
    next
  }
  return middleware[0]({
    ...context
  })
})

export default router

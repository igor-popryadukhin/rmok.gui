import store from '@/store'
import Home from '@/views/Home.vue'
import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { NavigationGuardNext } from 'vue-router/types/router'
import { Store } from 'vuex'

Vue.use(VueRouter)

// Взлом
const originPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return originPush.call(this, location).catch((error) => error)
}

const routes: RouteConfig[] = [
  {
    component: Home,
    meta: {
      layout: 'default',
      middleware: [],
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
      middleware: []
    },
    name: 'login',
    path: '/login'
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      layout: 'clean',
      middleware: [],
      title: 'documents'
    },
    name: 'about',
    path: '/about'
  },
  {
    component: () => import(/* webpackChunkName: "help" */ '../views/Help/Help.vue'),
    meta: {
      layout: 'help',
      middleware: []
    },
    name: 'help',
    path: '/help'
  },

  /** Error Pages */
  {
    component: () => import(/* webpackChunkName: "not-found" */ '../views/NotFound.vue'),
    meta: {
      layout: 'clean',
      middleware: []
    },
    name: 'not_found',
    path: '*'
  },
  {
    component: () => import(/* webpackChunkName: "access-denied" */ '../views/AccessDenied.vue'),
    meta: {
      layout: 'clean',
      middleware: []
    },
    name: 'access_denied',
    path: '/access-denied'
  },

  {
    path: '/roles',
    component: () => import(/* webpackChunkName: "roles" */ '../views/Roles/Layout.vue'),
    children: [
      {
        component: () => import(/* webpackChunkName: "roles-list" */ '../views/Roles/List.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'roles',
        path: ''
      },
      {
        component: () => import(/* webpackChunkName: "roles-edit" */ '../views/Roles/Edit.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'roles_edit',
        path: ':role_id'
      }
    ],
    meta: {
      layout: 'default',
      middleware: []
    }
  },
  {
    path: '/contacts',
    children: [
      {
        component: () => import(/* webpackChunkName: "contacts" */ '../views/Contacts/Contacts.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'contacts',
        path: ''
      },
      {
        path: ':contact_id',
        component: () => import(/* webpackChunkName: "contacts-view" */ '../views/Contacts/View.vue'),
        children: [
          {
            name: 'contacts_view',
            path: '',
            component: () => import(/* webpackChunkName: "contacts-view-scenario" */ '../views/Contacts/ViewScenario.vue'),
            meta: { layout: 'default', middleware: [] }
          },
          {
            name: 'contacts_view_scenario',
            path: 'scenario',
            component: () => import(/* webpackChunkName: "contacts-view-scenario" */ '../views/Contacts/ViewScenario.vue'),
            meta: { layout: 'default', middleware: [] }
          },
          {
            component: () => import(/* webpackChunkName: "contacts-view-history" */ '../views/Contacts/ViewHistory.vue'),
            meta: { layout: 'default', middleware: [] },
            name: 'contacts_view_history',
            path: 'history'
          },
          {
            component: () => import(/* webpackChunkName: "contacts-view-tasks" */ '../views/Contacts/ViewTasks.vue'),
            meta: { layout: 'default', middleware: [] },
            name: 'contacts_view_tasks',
            path: 'tasks'
          }
        ],
        meta: { layout: 'default', middleware: [] }
      }
    ],
    component: () => import(/* webpackChunkName: "contacts" */ '../views/Contacts/Layout.vue'),
    meta: {
      layout: 'default',
      middleware: []
    }
  },
  {
    path: '/leads',
    component: () => import(/* webpackChunkName: "leads-layout" */ '../views/Leads/Layout.vue'),
    children: [
      {
        name: 'leads',
        path: '',
        component: () => import(/* webpackChunkName: "leads" */ '../views/Leads/List.vue'),
        meta: {
          layout: 'default',
          middleware: []
        }
      }
    ],
    meta: {
      anonymous: true,
      layout: 'default',
      middleware: []
    }
  },
  {
    name: 'queue',
    path: '/queue',
    component: () => import(/* webpackChunkName: "queue-leads" */ '../views/QueueLeads/List.vue'),
    meta: {
      layout: 'default',
      middleware: []
    }
  },
  {
    name: 'tasks',
    path: '/tasks',
    component: () => import(/* webpackChunkName: "tasks-list" */ '../views/Tasks/List.vue'),
    meta: { layout: 'default', middleware: [] }
  },
  {
    path: '/users',
    component: () => import(/* webpackChunkName: "users-list" */ '../views/Users/Layout.vue'),
    meta: {
      layout: 'default',
      middleware: []
    },
    children: [
      {
        component: () => import(/* webpackChunkName: "users-list" */ '../views/Users/List.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'users_list',
        path: ''
      },
      {
        component: () => import(/* webpackChunkName: "users-new" */ '../views/Users/UserNew.vue'),
        meta: { layout: 'default', middleware: [] },
        name: 'users_new',
        path: 'new'
      },
      {
        path: ':user_id',
        component: () => import(/* webpackChunkName: "users-edit" */ '../views/Users/UserEdit.vue'),
        children: [
          {
            component: () => import(/* webpackChunkName: "users-edit-main" */ '../views/Users/UserEditMain.vue'),
            meta: { layout: 'default', middleware: [] },
            name: 'users_edit_main',
            path: 'main'
          },
          {
            component: () => import(/* webpackChunkName: "users-edit-telephony" */ '../views/Users/UserEditTelephony.vue'),
            meta: { layout: 'default', middleware: [] },
            name: 'users_edit_telephony',
            path: 'telephony'
          },
          {
            component: () => import(/* webpackChunkName: "users-edit-schedule" */ '../views/Users/UserEditSchedule.vue'),
            meta: { layout: 'default', middleware: [], anonymous: true },
            name: 'users_edit_schedule',
            path: 'schedule'
          }
        ],
        meta: {
          layout: 'default',
          middleware: []
        }
      }
    ]
  },
  {
    children: [
      {
        component: () => import(/* webpackChunkName: "groups-list" */ '../views/Groups/List.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'groups_list',
        path: ''
      },
      {
        component: () => import(/* webpackChunkName: "groups-new" */ '../views/Groups/New.vue'),
        meta: {
          layout: 'default',
          middleware: []
        },
        name: 'groups_new',
        path: 'new'
      },
      {
        component: () => import(/* webpackChunkName: "groups-new" */ '../views/Groups/Edit.vue'),
        meta: {
          layout: 'default',
          middleware: []
        },
        name: 'groups_edit',
        path: ':id'
      }
    ],
    component: () => import(/* webpackChunkName: "groups-list" */ '../views/Users/Layout.vue'),
    meta: {
      layout: 'default',
      middleware: []
    },
    path: '/groups'
  },
  {
    component: () => import(/* webpackChunkName: "integrations-layout" */ '../views/Settings/Layout.vue'),
    children: [
      {
        component: () => import(/* webpackChunkName: "integrations-contacts-list" */ '@/views/Integrations/Contacts/List.vue'),
        meta: {
          icon: '',
          layout: 'default',
          middleware: []
        },
        name: 'integrations_contacts',
        path: 'contacts'
      },
      {
        children: [
          {
            component: () => import(/* webpackChunkName: "itegrationset-list" */ '../views/Integrations/IntegrationSettings/List.vue'),
            meta: {
              anonymous: true,
              layout: 'default',
              middleware: []
            },
            name: 'itegrationset_list',
            path: ''
          },
          {
            component: () => import(/* webpackChunkName: "itegrationset-new" */ '../views/Integrations/IntegrationSettings/New.vue'),
            meta: {
              layout: 'default',
              middleware: []
            },
            name: 'itegrationset_new',
            path: 'new'
          },
          {
            component: () => import(/* webpackChunkName: "itegrationset-edit" */ '../views/Integrations/IntegrationSettings/Edit.vue'),
            meta: {
              layout: 'default',
              middleware: []
            },
            name: 'itegrationset_edit',
            path: ':id'
          }
        ],
        component: () => import(/* webpackChunkName: "itegrationset-list" */ '../views/Integrations/IntegrationSettings/Layout.vue'),
        meta: {
          layout: 'default',
          middleware: []
        },
        path: 'itegrationset'
      }
    ],
    meta: {
      layout: 'default',
      middleware: []
    },
    name: 'integrations',
    path: '/integrations'
  },
  {
    name: 'settings',
    path: '/settings',
    component: () => import(/* webpackChunkName: "settings-layout" */ '../views/Settings/Layout.vue'),
    meta: {
      layout: 'default',
      middleware: []
    },
    children: [
      {
        component: () => import(/* webpackChunkName: "settings-profile" */ '../views/Settings/Profile.vue'),
        meta: {
          icon: 'mdi-account-circle-outline',
          layout: 'default',
          middleware: []
        },
        name: 'settings_profile',
        path: 'profile'
      },
      {
        component: () => import(/* webpackChunkName: "settings-profile" */ '../views/Settings/Contacts.vue'),
        meta: {
          icon: 'mdi-account-circle-outline',
          layout: 'default',
          middleware: []
        },
        name: 'settings_contacts',
        path: 'contacts'
      },
      {
        component: () => import(/* webpackChunkName: "settings-regional" */ '../views/Settings/Regional.vue'),
        meta: {
          icon: 'mdi-translate',
          layout: 'default',
          middleware: []
        },
        name: 'settings_regional',
        path: 'regional'
      },
      {
        component: () => import(/* webpackChunkName: "settings-journal" */ '../views/Settings/Journal.vue'),
        meta: {
          icon: 'mdi-history',
          layout: 'default',
          middleware: []
        },
        name: 'settings_journal',
        path: 'journal'
      },
      {
        component: () => import(/* webpackChunkName: "settings-telephony" */ '../views/Settings/Telephony.vue'),
        meta: {
          icon: 'mdi-history',
          layout: 'default',
          middleware: []
        },
        name: 'settings_telephony',
        path: 'telephony'
      },
      {
        component: () => import(/* webpackChunkName: "settings-security" */ '../views/Settings/Security.vue'),
        meta: {
          icon: 'mdi-security',
          layout: 'default',
          middleware: []
        },
        name: 'settings_security',
        path: 'security'
      },
      {
        component: () => import(/* webpackChunkName: "settings-for-developer" */ '../views/Settings/DeveloperSettings.vue'),
        meta: {
          icon: 'mdi-flask',
          layout: 'default',
          middleware: []
        },
        name: 'settings_for_developer',
        path: 'development'
      },
      {
        component: () => import(/* webpackChunkName: "settings-system" */ '../views/Settings/System.vue'),
        meta: {
          icon: 'mdi-cog',
          layout: 'default',
          middleware: []
        },
        name: 'settings_system',
        path: 'system'
      }
    ]
  },
  {
    children: [
      {
        component: () => import(/* webpackChunkName: "projects" */ '../views/Projects/List.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'projects_list',
        path: ''
      },
      {
        component: () => import(/* webpackChunkName: "projects-edit" */ '@/views/Projects/ProjectEdit.vue'),
        children: [
          {
            component: () => import(/* webpackChunkName: "projects-edit-main" */ '@/views/Projects/ProjectEditMain.vue'),
            meta: {
              layout: 'default',
              middleware: []
            },
            name: 'projects_main',
            path: 'main',
            props: true
          },
          {
            component: () => import(/* webpackChunkName: "projects-edit-members" */ '@/views/Projects/ProjectEditMembers.vue'),
            meta: {
              layout: 'default',
              middleware: []
            },
            name: 'projects_members',
            path: 'members'
          },
          {
            component: () => import(/* webpackChunkName: "projects-edit-statuses" */ '@/views/Projects/ProjectEditStatuses.vue'),
            meta: {
              layout: 'default',
              middleware: []
            },
            name: 'projects_statuses',
            path: 'statuses'
          }
        ],
        meta: {
          layout: 'default',
          middleware: []
        },
        name: 'projects_edit',
        path: ':project_id',
        redirect: {
          name: 'projects_main'
        }
      }
    ],
    component: () => import(/* webpackChunkName: "administrator" */ '../views/Projects/Layout.vue'),
    meta: {
      layout: 'default',
      middleware: []
    },
    path: '/projects'
  },
  {
    children: [
      {
        component: () => import(/* webpackChunkName: "statistics-recent-calls" */ '../views/Statistics/RecentCalls.vue'),
        meta: {
          layout: 'default',
          middleware: []
        },
        name: 'statistics_recent_calls',
        path: 'recent-calls'
      },
      {
        component: () => import(/* webpackChunkName: "statistics-all-calls" */ '../views/Statistics/AllCalls.vue'),
        meta: {
          layout: 'default',
          middleware: []
        },
        name: 'statistics_all_calls',
        path: 'all-calls'
      },
      {
        component: () => import(/* webpackChunkName: "statistics-call-count" */ '../views/Statistics/CallCount.vue'),
        meta: {
          layout: 'default',
          middleware: []
        },
        name: 'statistics_call_count',
        path: 'call-count'
      },
      {
        component: () => import(/* webpackChunkName: "statistics-activity" */ '../views/Statistics/Activity.vue'),
        meta: {
          layout: 'default',
          middleware: []
        },
        name: 'statistics_activity',
        path: 'activity'
      },
      {
        component: () => import(/* webpackChunkName: "statistics-unauthorized-breaks" */ '../views/Statistics/UnauthorizedBreaks.vue'),
        meta: {
          layout: 'default',
          middleware: []
        },
        name: 'statistics_unauthorized_breaks',
        path: 'unauthorized-breaks'
      }
    ],
    component: () => import(/* webpackChunkName: "statistics" */ '../views/Statistics/Layout.vue'),
    meta: {
      layout: 'default',
      middleware: []
    },
    name: 'statistics',
    path: '/statistics'
  }
]

// Symfony profiler
if (process.env.NODE_ENV === 'development') {
  routes.push({
    component: () => import(/* webpackChunkName: "symfony-profiler-list" */ '../views/SymfonyProfiler.vue'),
    meta: {
      layout: 'clean',
      middleware: [],
      title: 'Symfony profiler'
    },
    name: 'symfony_profiler',
    path: '/_profiler'
  })
}

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes,
  scrollBehavior (to: Route) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        if (to.hash) {
          // До якоря
          resolve({
            selector: to.hash,
            behavior: 'smooth'
          })
        } else {
          // До самого верха
          resolve({
            x: 0,
            y: 0,
            behavior: 'smooth'
          })
        }
      }, 500)
    })
  }
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
    from,
    next,
    store,
    to
  }
  return middleware[0]({
    ...context
  })
})

export default router

import Home from '@/views/Home.vue'
import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { NavigationGuardNext } from 'vue-router/types/router'
import { Store } from 'vuex'

Vue.use(VueRouter)

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
    path: '/auto-dialer',
    children: [
      {
        component: () => import(/* webpackChunkName: "auto-dialer-list" */ '../views/AutoDialer/AutoDialerList.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'auto_dialer_params',
        path: ''
      }
    ],
    component: () => import(/* webpackChunkName: "auto-dialer" */ '../views/AutoDialer/Layout.vue'),
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'auto_dialer_view',
    path: '/auto-dialer/:id',
    redirect: {
      name: 'auto_dialer_view_tab_main'
    },
    component: () => import(/* webpackChunkName: "auto-dialer-view" */ '../views/AutoDialer/AutoDialerView/Index.vue'),
    meta: {
      anonymous: true,
      layout: 'default',
      middleware: []
    },
    children: [
      {
        component: () => import(/* webpackChunkName: "auto-dialer-view-tab-main" */ '../views/AutoDialer/AutoDialerView/Main/Main.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'auto_dialer_view_tab_main',
        path: 'main'
      },
      {
        component: () => import(/* webpackChunkName: "auto-dialer-view-tab-journal" */ '../views/AutoDialer/AutoDialerView/Journal/Journal.vue'),
        meta: { anonymous: true, layout: 'default', middleware: [] },
        name: 'auto_dialer_view_tab_journal',
        path: 'journal'
      },
      {
        component: () => import(/* webpackChunkName: "auto-dialer-view-tab-contacts" */ '../views/AutoDialer/AutoDialerView/Contacts/Contacts.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'auto_dialer_view_tab_contacts',
        path: 'contacts'
      },
      {
        component: () => import(/* webpackChunkName: "auto-dialer-view-tab-operators" */ '../views/AutoDialer/AutoDialerView/Operators/Index.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'auto_dialer_view_tab_operators',
        path: 'operators'
      },
      {
        component: () => import(/* webpackChunkName: "auto-dialer-view-tab-schedule" */ '../views/AutoDialer/AutoDialerView/Schedule/Index.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'auto_dialer_view_tab_schedule',
        path: 'schedule'
      },
      {
        component: () => import(/* webpackChunkName: "auto-dialer-view-tab-calls-processing-rules" */ '../views/AutoDialer/AutoDialerView/CallsProcessingRules/CallsProcessingRules.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'auto_dialer_view_tab_calls_processing_rules',
        path: 'calls-processing-rules'
      },
      {
        component: () => import(/* webpackChunkName: "auto-dialer-view-tab-telephony" */ '../views/AutoDialer/AutoDialerView/Telephony/Index.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'auto_dialer_view_tab_telephony',
        path: 'telephony'
      }
    ]
  },
  {
    name: 'roles',
    path: '/roles',
    component: () => import(/* webpackChunkName: "roles" */ '../views/Roles/Roles.vue'),
    children: [],
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'roles_view',
    path: '/roles/:id',
    component: () => import(/* webpackChunkName: "roles-view" */ '../views/Roles/RolesView.vue'),
    children: [],
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'contacts_in_works',
    path: '/contacts-in-work',
    component: () => import(/* webpackChunkName: "contacts-in-work" */ '../views/Contacts/ContactsInWork/ContactsInWork.vue'),
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'contacts',
    path: '/contacts',
    component: () => import(/* webpackChunkName: "contacts" */ '../views/Contacts/ContactsList/ContactsList.vue'),
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'contacts_view',
    path: '/contacts/:id',
    redirect: { name: 'contacts_view_history' },
    component: () => import(/* webpackChunkName: "contacts-view" */ '../views/Contacts/ContactsView/ContactsView.vue'),
    children: [
      {
        name: 'contacts_view_scenario',
        path: 'scenario',
        component: () => import(/* webpackChunkName: "contacts-view-scenario" */ '../views/Contacts/ContactsView/ContactsViewScenario.vue'),
        meta: { layout: 'default', middleware: [] }
      },
      {
        component: () => import(/* webpackChunkName: "contacts-view-history" */ '../views/Contacts/ContactsView/ContactsViewHistory.vue'),
        meta: { layout: 'default', middleware: [] },
        name: 'contacts_view_history',
        path: 'history'
      },
      {
        component: () => import(/* webpackChunkName: "contacts-view-tasks" */ '../views/Contacts/ContactsView/ContactsViewTasks.vue'),
        meta: { layout: 'default', middleware: [] },
        name: 'contacts_view_tasks',
        path: 'tasks'
      },
      {
        component: () => import(/* webpackChunkName: "contacts-view-status" */ '../views/Contacts/ContactsView/ContactsViewStatus.vue'),
        meta: { layout: 'default', middleware: [] },
        name: 'contacts_view_status',
        path: 'status'
      },
      {
        component: () => import(/* webpackChunkName: "contacts-view-messages" */ '../views/Contacts/ContactsView/ContactsViewMessages.vue'),
        meta: { layout: 'default', middleware: [] },
        name: 'contacts_view_messages',
        path: 'messages'
      }
    ],
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'leads',
    path: '/leads',
    component: () => import(/* webpackChunkName: "leads" */ '../views/Leads/Leads.vue'),
    meta: { layout: 'default', middleware: [] }
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
    redirect: { name: 'tasks_list', params: { id: 'for-today' } },
    component: () => import(/* webpackChunkName: "tasks" */ '../views/Tasks/Tasks.vue'),
    children: [
      {
        name: 'tasks_list',
        path: ':id',
        component: () => import(/* webpackChunkName: "tasks-list" */ '../views/Tasks/TasksList.vue'),
        meta: { layout: 'default', middleware: [] },
        props: true
      }
    ],
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'users',
    path: '/users',
    component: () => import(/* webpackChunkName: "users-list" */ '../views/Users/Users.vue'),
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'users_create',
    path: '/users/create',
    component: () => import(/* webpackChunkName: "users-create" */ '../views/Users/UsersCreate.vue'),
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'users_view',
    path: '/users/:id',
    redirect: { name: 'users_view_main' },
    component: () => import(/* webpackChunkName: "users-view" */ '../views/Users/UsersView.vue'),
    children: [
      {
        component: () => import(/* webpackChunkName: "users-view-main" */ '../views/Users/UsersViewMain.vue'),
        meta: { layout: 'default', middleware: [] },
        name: 'users_view_main',
        path: 'main'
      },
      {
        component: () => import(/* webpackChunkName: "users-view-telephony" */ '../views/Users/UsersViewTelephony.vue'),
        meta: { layout: 'default', middleware: [] },
        name: 'users_view_telephony',
        path: 'telephony'
      },
      {
        component: () => import(/* webpackChunkName: "users-view-contacts" */ '../views/Users/UsersViewContacts.vue'),
        meta: { layout: 'default', middleware: [] },
        name: 'users_view_contacts',
        path: 'contacts'
      },
      {
        component: () => import(/* webpackChunkName: "users-view-sessions" */ '../views/Users/UsersViewSessions.vue'),
        meta: { layout: 'default', middleware: [] },
        name: 'users_view_sessions',
        path: 'sessions'
      },
      {
        component: () => import(/* webpackChunkName: "users-view-schedule" */ '../views/Users/UsersViewSchedule.vue'),
        meta: { layout: 'default', middleware: [] },
        name: 'users_view_schedule',
        path: 'schedule'
      }
    ],
    meta: { layout: 'default', middleware: [] }
  },
  // {
  //   children: [
  //     {
  //       component: () => import(/* webpackChunkName: "groups-list" */ '../views/Groups/List.vue'),
  //       meta: {
  //         anonymous: true,
  //         layout: 'default',
  //         middleware: []
  //       },
  //       name: 'groups_list',
  //       path: ''
  //     },
  //     {
  //       component: () => import(/* webpackChunkName: "groups-new" */ '../views/Groups/New.vue'),
  //       meta: {
  //         layout: 'default',
  //         middleware: []
  //       },
  //       name: 'groups_new',
  //       path: 'new'
  //     },
  //     {
  //       component: () => import(/* webpackChunkName: "groups-new" */ '../views/Groups/Edit.vue'),
  //       meta: {
  //         layout: 'default',
  //         middleware: []
  //       },
  //       name: 'groups_edit',
  //       path: ':id'
  //     }
  //   ],
  //   component: () => import(/* webpackChunkName: "groups-list" */ '../views/Users/Layout.vue'),
  //   meta: {
  //     layout: 'default',
  //     middleware: []
  //   },
  //   path: '/groups'
  // },
  // {
  //   component: () => import(/* webpackChunkName: "integrations-layout" */ '../views/Settings/Layout.vue'),
  //   children: [
  //     {
  //       component: () => import(/* webpackChunkName: "integrations-contacts-list" */ '@/views/Integrations/Contacts/List.vue'),
  //       meta: {
  //         icon: '',
  //         layout: 'default',
  //         middleware: []
  //       },
  //       name: 'integrations_contacts',
  //       path: 'contacts'
  //     },
  //     {
  //       children: [
  //         {
  //           component: () => import(/* webpackChunkName: "itegrationset-list" */ '../views/Integrations/IntegrationSettings/List.vue'),
  //           meta: {
  //             anonymous: true,
  //             layout: 'default',
  //             middleware: []
  //           },
  //           name: 'itegrationset_list',
  //           path: ''
  //         },
  //         {
  //           component: () => import(/* webpackChunkName: "itegrationset-new" */ '../views/Integrations/IntegrationSettings/New.vue'),
  //           meta: {
  //             layout: 'default',
  //             middleware: []
  //           },
  //           name: 'itegrationset_new',
  //           path: 'new'
  //         },
  //         {
  //           component: () => import(/* webpackChunkName: "itegrationset-edit" */ '../views/Integrations/IntegrationSettings/Edit.vue'),
  //           meta: {
  //             layout: 'default',
  //             middleware: []
  //           },
  //           name: 'itegrationset_edit',
  //           path: ':id'
  //         }
  //       ],
  //       component: () => import(/* webpackChunkName: "itegrationset-list" */ '../views/Integrations/IntegrationSettings/Layout.vue'),
  //       meta: {
  //         layout: 'default',
  //         middleware: []
  //       },
  //       path: 'itegrationset'
  //     }
  //   ],
  //   meta: {
  //     layout: 'default',
  //     middleware: []
  //   },
  //   name: 'integrations',
  //   path: '/integrations'
  // },
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
        path: 'developers'
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
    name: 'projects',
    path: '/projects',
    component: () => import(/* webpackChunkName: "projects" */ '../views/Projects/Projects.vue'),
    children: [],
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'projects_view',
    path: '/projects/:id',
    redirect: { name: 'projects_view_main' },
    component: () => import(/* webpackChunkName: "projects-view" */ '../views/Projects/ProjectsView.vue'),
    children: [
      {
        name: 'projects_view_main',
        path: 'main',
        component: () => import(/* webpackChunkName: "projects-view-main" */ '../views/Projects/ProjectsViewMain.vue'),
        children: [],
        meta: { layout: 'default', middleware: [] }
      },
      {
        name: 'projects_view_people',
        path: 'people',
        component: () => import(/* webpackChunkName: "projects-view-people" */ '../views/Projects/ProjectsViewPeople.vue'),
        children: [],
        meta: { layout: 'default', middleware: [] }
      },
      {
        name: 'projects_view_statuses',
        path: 'statuses',
        component: () => import(/* webpackChunkName: "projects-view-people" */ '../views/Projects/ProjectsViewStatuses.vue'),
        children: [],
        meta: { layout: 'default', middleware: [] }
      }
    ],
    meta: { layout: 'default', middleware: [] }
  },

  {
    name: 'statistics_recent_calls',
    path: '/statistics/recent-calls',
    component: () => import(/* webpackChunkName: "statistics-recent-calls" */ '../views/Statistics/RecentCalls/RecentCalls.vue'),
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'statistics_calls_count',
    path: '/statistics/calls-count',
    component: () => import(/* webpackChunkName: "statistics-call-count" */ '../views/Statistics/CallsCount/CallsCount.vue'),
    meta: { layout: 'default', middleware: [] }
  },
  {
    children: [],
    component: () => import(/* webpackChunkName: "statistics" */ '../views/Statistics/Layout.vue'),
    meta: {
      layout: 'default',
      middleware: []
    },
    name: 'statistics',
    path: '/statistics'
  },
  {
    name: 'scenarios',
    path: '/scenarios',
    children: [],
    component: () => import(/* webpackChunkName: "scenarios" */ '../views/Scenarios/Scenarios.vue'),
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'scenarios_view',
    path: '/scenarios/:id',
    children: [],
    component: () => import(/* webpackChunkName: "scenarios-view" */ '../views/Scenarios/ScenariosView.vue'),
    meta: { layout: 'default', middleware: [] }
  },
  {
    name: 'integrations',
    path: '/integrations',
    component: () => import(/* webpackChunkName: "integrations" */ '../views/Integrations/Integrations.vue'),
    meta: { layout: 'default', middleware: [] },
    children: []
  },
  {
    name: 'integrations_whatsapp',
    path: '/integrations/whatsapp',
    component: () => import(/* webpackChunkName: "integrations-whatsapp" */ '../views/Integrations/Whatsapp/Whatsapp.vue'),
    meta: { layout: 'default', middleware: [] },
    children: []
  }
  // {
  //   name: 'integrations',
  //   path: '/integrations',
  //   component: () => import(/* webpackChunkName: "integrations" */ '../views/Chats/Integrations/Integrations.vue'),
  //   meta: { layout: 'default', middleware: [] },
  //   children: []
  // },
  // {
  //   name: 'integrations_view',
  //   path: '/integrations/:id',
  //   component: () => import(/* webpackChunkName: "integrations-view" */ '../views/Chats/Integrations/IntegrationsView.vue'),
  //   meta: { layout: 'default', middleware: [] },
  //   children: []
  // }
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
  routes.push({
    component: () => import(/* webpackChunkName: "symfony-profiler-list" */ '../views/Development/Index.vue'),
    meta: {
      layout: 'default',
      middleware: [],
      title: 'Only for developers'
    },
    name: 'development',
    path: '/development'
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
  store?: Store<any>
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
    from,
    next,
    to
  }
  return middleware[0]({
    ...context
  })
})

export default router

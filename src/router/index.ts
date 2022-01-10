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
      },
      {
        component: () => import(/* webpackChunkName: "auto-dialer-view" */ '../views/AutoDialer/AutoDialerView/Index.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        path: ':id',
        children: [
          {
            redirect: {
              name: 'auto_dialer_tab_main'
            },
            path: ''
          },
          {
            component: () => import(/* webpackChunkName: "auto-dialer-tab-main" */ '../views/AutoDialer/AutoDialerView/Main/Index.vue'),
            meta: {
              anonymous: true,
              layout: 'default',
              middleware: []
            },
            name: 'auto_dialer_tab_main',
            path: 'main'
          },
          {
            component: () => import(/* webpackChunkName: "auto-dialer-tab-contacts" */ '../views/AutoDialer/AutoDialerView/Contacts/Index.vue'),
            meta: {
              anonymous: true,
              layout: 'default',
              middleware: []
            },
            name: 'auto_dialer_tab_contacts',
            path: 'contacts'
          },
          {
            component: () => import(/* webpackChunkName: "auto-dialer-tab-operators" */ '../views/AutoDialer/AutoDialerView/Operators/Index.vue'),
            meta: {
              anonymous: true,
              layout: 'default',
              middleware: []
            },
            name: 'auto_dialer_tab_operators',
            path: 'operators'
          },
          {
            component: () => import(/* webpackChunkName: "auto-dialer-tab-schedule" */ '../views/AutoDialer/AutoDialerView/Schedule/Index.vue'),
            meta: {
              anonymous: true,
              layout: 'default',
              middleware: []
            },
            name: 'auto_dialer_tab_schedule',
            path: 'schedule'
          },
          {
            component: () => import(/* webpackChunkName: "auto-dialer-tab-repeat-call-settings" */ '../views/AutoDialer/AutoDialerView/RepeatСallSettings/Index.vue'),
            meta: {
              anonymous: true,
              layout: 'default',
              middleware: []
            },
            name: 'auto_dialer_tab_repeat_calls_settings',
            path: 'repeat-call-settings'
          },
          {
            component: () => import(/* webpackChunkName: "auto-dialer-tab-telephony" */ '../views/AutoDialer/AutoDialerView/Telephony/Index.vue'),
            meta: {
              anonymous: true,
              layout: 'default',
              middleware: []
            },
            name: 'auto_dialer_tab_telephony',
            path: 'telephony'
          }
        ]
      }
    ],
    component: () => import(/* webpackChunkName: "auto-dialer" */ '../views/AutoDialer/Layout.vue'),
    meta: {
      layout: 'default',
      middleware: []
    }
  },
  {
    path: '/roles',
    component: () => import(/* webpackChunkName: "roles" */ '../views/Roles/Layout.vue'),
    children: [
      {
        component: () => import(/* webpackChunkName: "roles-list" */ '../views/Roles/Items/Index.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'roles',
        path: ''
      },
      {
        component: () => import(/* webpackChunkName: "roles-edit" */ '../views/Roles/Edit/Index.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'roles_edit',
        path: ':id'
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
        component: () => import(/* webpackChunkName: "contact-list" */ '../views/Contacts/ContactList/Index.vue'),
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
        component: () => import(/* webpackChunkName: "contacts-view-layout" */ '../views/Contacts/ContactsView/ContactsView.vue'),
        children: [
          {
            name: 'contacts_view',
            path: '',
            component: () => import(/* webpackChunkName: "contacts-view-scenario" */ '../views/Contacts/ContactsView/ContactsViewScenario.vue'),
            meta: { layout: 'default', middleware: [] }
          },
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
          }
        ],
        meta: { layout: 'default', middleware: [] },
        redirect: { name: 'contacts_view' }
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
  // {
  //   path: '/users',
  //   component: () => import(/* webpackChunkName: "users-list" */ '../views/Users/Layout.vue'),
  //   meta: {
  //     layout: 'default',
  //     middleware: []
  //   },
  //   children: [
  //     {
  //       component: () => import(/* webpackChunkName: "users-list" */ '../views/Users/List.vue'),
  //       meta: {
  //         anonymous: true,
  //         layout: 'default',
  //         middleware: []
  //       },
  //       name: 'users_list',
  //       path: ''
  //     },
  //     {
  //       component: () => import(/* webpackChunkName: "users-create" */ '../views/Users/UserCreate.vue'),
  //       meta: { layout: 'default', middleware: [] },
  //       name: 'users_create',
  //       path: 'create'
  //     },
  //     {
  //       path: ':user_id',
  //       component: () => import(/* webpackChunkName: "users-edit" */ '../views/Users/UserEdit.vue'),
  //       children: [
  //         {
  //           component: () => import(/* webpackChunkName: "users-edit-main" */ '../views/Users/UserEditMain.vue'),
  //           meta: { layout: 'default', middleware: [] },
  //           name: 'users_edit_main',
  //           path: 'main'
  //         },
  //         {
  //           component: () => import(/* webpackChunkName: "users-edit-telephony" */ '../views/Users/UserEditTelephony.vue'),
  //           meta: { layout: 'default', middleware: [] },
  //           name: 'users_edit_telephony',
  //           path: 'telephony'
  //         },
  //         {
  //           component: () => import(/* webpackChunkName: "users-edit-schedule" */ '../views/Users/UserEditSchedule.vue'),
  //           meta: { layout: 'default', middleware: [], anonymous: true },
  //           name: 'users_edit_schedule',
  //           path: 'schedule'
  //         },
  //         {
  //           component: () => import(/* webpackChunkName: "users-edit-capabilities" */ '../views/Users/UserCapabilities.vue'),
  //           meta: { layout: 'default', middleware: [], anonymous: true },
  //           name: 'users_edit_capabilities',
  //           path: 'capabilities'
  //         },
  //         {
  //           component: () => import(/* webpackChunkName: "users-edit-sessions" */ '../views/Users/UserSessions.vue'),
  //           meta: { layout: 'default', middleware: [], anonymous: true },
  //           name: 'users_edit_sessions',
  //           path: 'sessions'
  //         }
  //       ],
  //       meta: {
  //         layout: 'default',
  //         middleware: []
  //       }
  //     }
  //   ]
  // },
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
    children: [
      {
        component: () => import(/* webpackChunkName: "statistics-recent-calls" */ '../views/Statistics/RecentCalls/Index.vue'),
        meta: {
          layout: 'default',
          middleware: []
        },
        name: 'statistics_recent_calls',
        path: 'recent-calls'
      }
      // {
      //   component: () => import(/* webpackChunkName: "statistics-all-calls" */ '../views/Statistics/AllCalls.vue'),
      //   meta: {
      //     layout: 'default',
      //     middleware: []
      //   },
      //   name: 'statistics_all_calls',
      //   path: 'all-calls'
      // },
      // {
      //   component: () => import(/* webpackChunkName: "statistics-call-count" */ '../views/Statistics/CallCount.vue'),
      //   meta: {
      //     layout: 'default',
      //     middleware: []
      //   },
      //   name: 'statistics_call_count',
      //   path: 'call-count'
      // },
      // {
      //   component: () => import(/* webpackChunkName: "statistics-activity" */ '../views/Statistics/Activity.vue'),
      //   meta: {
      //     layout: 'default',
      //     middleware: []
      //   },
      //   name: 'statistics_activity',
      //   path: 'activity'
      // },
      // {
      //   component: () => import(/* webpackChunkName: "statistics-unauthorized-breaks" */ '../views/Statistics/UnauthorizedBreaks.vue'),
      //   meta: {
      //     layout: 'default',
      //     middleware: []
      //   },
      //   name: 'statistics_unauthorized_breaks',
      //   path: 'unauthorized-breaks'
      // }
    ],
    component: () => import(/* webpackChunkName: "statistics" */ '../views/Statistics/Layout.vue'),
    meta: {
      layout: 'default',
      middleware: []
    },
    name: 'statistics',
    path: '/statistics'
  },
  {
    path: '/scenarios',
    children: [
      {
        component: () => import(/* webpackChunkName: "scenarios_list" */ '../views/Scenarios/ScenariosList.vue'),
        meta: {
          anonymous: true,
          layout: 'default',
          middleware: []
        },
        name: 'scenarios_list',
        path: ''
      },
      {
        component: () => import(/* webpackChunkName: "scenarios_edit" */ '../views/Scenarios/ScenariosEdit.vue'),
        meta: {
          layout: 'default',
          middleware: []
        },
        name: 'scenarios_edit',
        path: ':id/main'
      },
      {
        component: () => import(/* webpackChunkName: "scenarios_create" */ '../views/Scenarios/ScenariosCreate.vue'),
        meta: {
          layout: 'default',
          middleware: []
        },
        name: 'scenarios_create',
        path: 'create'
      }
    ],
    component: () => import(/* webpackChunkName: "scenarios" */ '../views/Scenarios/Layout.vue'),
    meta: {
      layout: 'default',
      middleware: []
    }
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

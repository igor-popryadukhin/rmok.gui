import { loadLanguageAsync } from '@/plugins/i18n'
import Home from '@/views/Home.vue'
import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { NavigationGuardNext } from 'vue-router/types/router'
import roleAdmin from '@/middleware/roleAdmin'
import roleRCC from '@/middleware/roleRCC'
import roleTeamLeader from '@/middleware/roleTeamLeader.ts'
import store from '@/store'
import { app } from '@/main'
import Timer from '@/classes/Timer'

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
          middleware: []
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
            meta: { layout: 'operator-layout', middleware: [] }
          }
        ],
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: []
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
              middleware: []
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
                meta: { layout: 'operator-layout', middleware: [] }
              },
              {
                path: 'history',
                name: 'operator_leads_history',
                component: () => import(/* webpackChunkName: "leads-history" */ '../views/Operator/Leads/History.vue'),
                meta: { layout: 'operator-layout', middleware: [] }
              },
              {
                path: 'tasks',
                name: 'operator_leads_task',
                component: () => import(/* webpackChunkName: "leads-task" */ '../views/Operator/Leads/Task.vue'),
                meta: { layout: 'operator-layout', middleware: [] }
              }
            ],
            meta: { layout: 'operator-layout', middleware: [] }
          }
        ],
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: []
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
              middleware: []
            }
          }
        ],
        meta: { layout: 'operator-layout', middleware: [] }
      },
      {
        path: 'contacts',
        component: () => import(/* webpackChunkName: "operator-contacts" */ '../views/Operator/Contacts/Layout.vue'),
        children: [
          {
            path: '',
            name: 'operator_contacts_list',
            component: () => import(/* webpackChunkName: "operator-contacts" */ '../views/Operator/Contacts/List.vue'),
            meta: { layout: 'operator-layout', middleware: [] }
          },
          {
            path: 'new',
            name: 'operator_contacts_new',
            component: () => import(/* webpackChunkName: "operator-contacts" */ '../views/Operator/Contacts/New.vue'),
            meta: { layout: 'operator-layout', middleware: [] },
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
                name: 'contacts_script',
                component: () => import(/* webpackChunkName: "operator-contacts-view-script" */ '../views/Operator/Contacts/Script.vue'),
                meta: { layout: 'operator-layout', middleware: [] }
              },
              {
                path: 'history',
                name: 'contacts_history',
                component: () => import(/* webpackChunkName: "operator-contacts-view-history" */ '../views/Operator/Contacts/History.vue'),
                meta: { layout: 'operator-layout', middleware: [] }
              },
              {
                path: 'tasks',
                name: 'contacts_task',
                component: () => import(/* webpackChunkName: "operator-contacts-view-task" */ '../views/Operator/Contacts/Task.vue'),
                meta: { layout: 'operator-layout', middleware: [] }
              }
            ],
            meta: { layout: 'operator-layout', middleware: [] }
          }
        ],
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'contacts').then(() => next())
        },
        meta: {
          anonymous: true,
          layout: 'operator-layout',
          middleware: []
        }
      },
      {
        path: 'reports',
        component: () => import(/* webpackChunkName: "operator-reports" */ '../views/Operator/Reports/Layout.vue'),
        children: [
          {
            path: '',
            name: 'operator_reports',
            component: () => import(/* webpackChunkName: "operator-reports" */ '../views/Operator/Reports/Index.vue'),
            meta: {
              anonymous: true,
              layout: 'operator-layout',
              middleware: []
            }
          }
        ],
        meta: {
          layout: 'operator-layout',
          middleware: []
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
              middleware: []
            }
          },
          {
            path: 'journal',
            name: 'operator_settings_journal',
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Journal.vue'),
            meta: {
              icon: 'mdi-history',
              layout: 'operator-layout',
              middleware: []
            }
          },
          {
            path: 'security',
            name: 'operator_settings_security',
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Security.vue'),
            meta: {
              icon: 'mdi-security',
              layout: 'operator-layout',
              middleware: []
            }
          },
          {
            path: 'telephony',
            name: 'operator_settings_telephony',
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/Telephony.vue'),
            meta: {
              icon: 'mdi-security',
              layout: 'operator-layout',
              middleware: []
            }
          },
          {
            path: 'headset-configure',
            name: 'operator_settings_headset_configure',
            component: () => import(/* webpackChunkName: "operator-settings" */ '../views/Operator/Settings/HeadsetConfigure.vue'),
            meta: {
              icon: 'mdi-security',
              layout: 'operator-layout',
              middleware: []
            }
          }
        ],
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'settings').then(() => next())
        },
        meta: {
          layout: 'operator-layout',
          middleware: []
        }
      },
      {
        path: 'help',
        name: 'operator_help',
        component: () => import(/* webpackChunkName: "operator-help" */ '../views/Operator/Help/Index.vue'),
        meta: {
          layout: 'operator-layout',
          middleware: []
        }
      }
    ],
    meta: {
      anonymous: true,
      layout: 'operator-layout',
      middleware: []
    },
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      store.dispatch('system/roles').then()
      loadLanguageAsync('ru', 'operator').then(() => next())
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
      middleware: []
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
          middleware: [roleAdmin]
        }
      },
      {
        path: 'organizations',
        component: () => import(/* webpackChunkName: "administrator-organizations" */ '../views/Administrator/Organizations/Layout.vue'),
        children: [
          {
            path: '',
            name: 'administrator_organizations_list',
            component: () => import(/* webpackChunkName: "administrator-organizations" */ '../views/Administrator/Organizations/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: 'new',
            name: 'administrator_organizations_new',
            component: () => import(/* webpackChunkName: "administrator-organizations" */ '../views/Administrator/Organizations/New.vue'),
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
            component: () => import(/* webpackChunkName: "administrator-organizations" */ '../views/Administrator/Organizations/Edit.vue'),
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
            component: () => import(/* webpackChunkName: "administrator-users" */ '../views/Administrator/Users/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: 'new',
            name: 'administrator_users_new',
            component: () => import(/* webpackChunkName: "administrator-users" */ '../views/Administrator/Users/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: ':id',
            name: 'administrator_users_edit',
            component: () => import(/* webpackChunkName: "administrator-users" */ '../views/Administrator/Users/Edit.vue'),
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
            component: () => import(/* webpackChunkName: "administrator-groups" */ '../views/Administrator/Groups/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: 'new',
            name: 'administrator_groups_new',
            component: () => import(/* webpackChunkName: "administrator-groups" */ '../views/Administrator/Groups/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: ':id',
            name: 'administrator_groups_edit',
            component: () => import(/* webpackChunkName: "administrator-groups" */ '../views/Administrator/Groups/Edit.vue'),
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
            component: () => import(/* webpackChunkName: "administrator-settings" */ '../views/Administrator/Settings/Profile.vue'),
            meta: {
              icon: 'mdi-account-circle-outline',
              layout: 'administrator',
              middleware: []
            }
          },
          {
            path: 'journal',
            name: 'administrator_journal',
            component: () => import(/* webpackChunkName: "administrator-settings" */ '../views/Administrator/Settings/Journal.vue'),
            meta: {
              icon: 'mdi-history',
              layout: 'administrator',
              middleware: []
            }
          },
          {
            path: 'security',
            name: 'administrator_security',
            component: () => import(/* webpackChunkName: "administrator-settings" */ '../views/Administrator/Settings/Security.vue'),
            meta: {
              icon: 'mdi-security',
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
        component: () => import(/* webpackChunkName: "administrator-projects" */ '../views/Administrator/Projects/Layout.vue'),
        children: [
          {
            path: '',
            name: 'administrator_projects_list',
            component: () => import(/* webpackChunkName: "administrator-projects" */ '../views/Administrator/Projects/List.vue'),
            meta: {
              anonymous: true,
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: 'new',
            name: 'administrator_projects_new',
            component: () => import(/* webpackChunkName: "administrator-projects" */ '../views/Administrator/Projects/New.vue'),
            meta: {
              layout: 'administrator',
              middleware: [roleAdmin]
            }
          },
          {
            path: ':project_id',
            name: 'administrator_projects_edit',
            component: () => import(/* webpackChunkName: "administrator-projects" */ '../views/Administrator/Projects/Edit.vue'),
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
          Promise.all([
            loadLanguageAsync('ru', 'projects'),
            loadLanguageAsync('ru', 'status-actions')
          ]).then(() => next())
        }
      }
    ],
    meta: {
      layout: 'administrator',
      anonymous: true,
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
        component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Reports/Layout.vue'),
        children: [
          {
            path: 'recent-calls',
            name: 'call_center_manager_reports_recent_calls',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Reports/RecentCalls.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: 'all-calls',
            name: 'call_center_manager_reports_all_calls',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Reports/AllCalls.vue'),
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
        component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Contacts/Layout.vue'),
        children: [
          {
            path: '',
            name: 'call_center_manager_contacts',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Contacts/List.vue'),
            meta: {
              // anonymous: true,
              layout: 'call-center-manager',
              middleware: []
            }
          },
          {
            name: 'call_center_manager_contacts_new',
            path: 'new',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Contacts/New.vue'),
            meta: {
              anonymous: true,
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            name: 'call_center_manager_contacts_edit',
            path: ':contact_id',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Contacts/Edit.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: ':contact_id',
            name: 'call_center_manager_contacts_view',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Contacts/View.vue'),
            children: [
              {
                path: 'script',
                name: 'call_center_manager_contacts_view_script',
                component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Contacts/Script.vue'),
                meta: { layout: 'call-center-manager', middleware: [] }
              },
              {
                path: 'history',
                name: 'call_center_manager_contacts_view_history',
                component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Contacts/History.vue'),
                meta: { layout: 'call-center-manager', middleware: [] }
              },
              {
                path: 'tasks',
                name: 'call_center_manager_contacts_view_task',
                component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Contacts/Task.vue'),
                meta: { layout: 'call-center-manager', middleware: [] }
              }
            ],
            meta: { layout: 'call-center-manager', middleware: [] }
          }
        ],
        meta: {
          anonymous: true,
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
        component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Users/Layout.vue'),
        children: [
          {
            path: '',
            name: 'call_center_manager_users',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Users/List.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: 'new',
            name: 'call_center_manager_users_new',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Users/New.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: ':id',
            name: 'call_center_manager_users_edit',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Users/Edit.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          }
        ],
        meta: {
          anonymous: true,
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
        component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Groups/Layout.vue'),
        children: [
          {
            path: '',
            name: 'call_center_manager_groups',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Groups/List.vue'),
            meta: {
              anonymous: true,
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: 'new',
            name: 'call_center_manager_group_new',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Groups/New.vue'),
            meta: {
              layout: 'call-center-manager',
              middleware: [roleRCC]
            }
          },
          {
            path: ':id',
            name: 'call_center_manager_group_edit',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Groups/Edit.vue'),
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
        component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Settings/Layout.vue'),
        children: [
          {
            path: 'profile',
            name: 'call_center_manager_profile',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Settings/Profile.vue'),
            meta: {
              icon: 'mdi-account-circle-outline',
              layout: 'call-center-manager',
              middleware: []
            }
          },
          {
            path: 'journal',
            name: 'call_center_manager_journal',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Settings/Journal.vue'),
            meta: {
              icon: 'mdi-history',
              layout: 'call-center-manager',
              middleware: []
            }
          },
          {
            path: 'security',
            name: 'call_center_manager_security',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Settings/Security.vue'),
            meta: {
              icon: 'mdi-security',
              layout: 'call-center-manager',
              middleware: []
            }
          },
          {
            path: 'developer-settings',
            name: 'call_center_manager_developer_settings',
            component: () => import(/* webpackChunkName: "call-center-manager" */ '../views/CallCenterManage/Settings/DeveloperSettings.vue'),
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
      anonymous: true,
      layout: 'call-center-manager',
      middleware: [roleRCC]
    },
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      store.dispatch('system/roles').then()
      loadLanguageAsync('ru', 'call-center-manager').then(() => next())
    }
  },

  /** Call center manager */
  {
    path: '/team-leader',
    name: 'team_leader',
    component: () => import(/* webpackChunkName: "team-leader" */ '../views/TeamLeader/Layout.vue'),
    children: [
      {
        path: 'reports',
        name: 'team_leader_reports',
        component: () => import(/* webpackChunkName: "team-leader-reports" */ '../views/TeamLeader/Reports/Layout.vue'),
        children: [
          {
            path: 'recent-calls',
            name: 'team_leader_reports_recent_calls',
            component: () => import(/* webpackChunkName: "team-leader-reports-recent-calls" */ '../views/TeamLeader/Reports/RecentCalls.vue'),
            meta: {
              layout: 'team-leader',
              middleware: []
            }
          },
          {
            path: 'all-calls',
            name: 'team_leader_reports_all_calls',
            component: () => import(/* webpackChunkName: "team-leader-reports-all-calls" */ '../views/TeamLeader/Reports/AllCalls.vue'),
            meta: {
              layout: 'team-leader',
              middleware: []
            }
          }
        ],
        meta: {
          layout: 'team-leader',
          middleware: [roleTeamLeader]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          next()
        }
      },
      {
        path: 'users',
        component: () => import(/* webpackChunkName: "team-leader-users" */ '../views/TeamLeader/Users/Layout.vue'),
        children: [
          {
            path: '',
            name: 'team_leader_users',
            component: () => import(/* webpackChunkName: "team-leader-users" */ '../views/TeamLeader/Users/List.vue'),
            meta: {
              anonymous: true,
              layout: 'team-leader',
              middleware: [roleTeamLeader]
            }
          },
          {
            path: 'new',
            name: 'team_leader_users_new',
            component: () => import(/* webpackChunkName: "team-leader-users-new" */ '../views/TeamLeader/Users/New.vue'),
            meta: {
              layout: 'team-leader',
              middleware: [roleTeamLeader]
            }
          },
          {
            path: ':id',
            name: 'team_leader_users_edit',
            component: () => import(/* webpackChunkName: "team-leader-users-edit" */ '../views/TeamLeader/Users/Edit.vue'),
            meta: {
              layout: 'team-leader',
              middleware: [roleTeamLeader]
            }
          }
        ],
        meta: {
          layout: 'team-leader',
          middleware: [roleTeamLeader]
        },
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          next()
        }
      },
      {
        path: 'settings',
        name: 'team_leader_settings',
        component: () => import(/* webpackChunkName: "team-leader-settings" */ '../views/TeamLeader/Settings/Layout.vue'),
        children: [
          {
            path: 'profile',
            name: 'team_leader_profile',
            component: () => import(/* webpackChunkName: "team-leader-settings-profile" */ '../views/TeamLeader/Settings/Profile.vue'),
            meta: {
              icon: 'mdi-account-circle-outline',
              layout: 'team-leader',
              middleware: []
            }
          },
          {
            path: 'journal',
            name: 'team_leader_journal',
            component: () => import(/* webpackChunkName: "team-leader-settings-journal" */ '../views/TeamLeader/Settings/Journal.vue'),
            meta: {
              icon: 'mdi-history',
              layout: 'team-leader',
              middleware: []
            }
          },
          {
            path: 'security',
            name: 'team_leader_security',
            component: () => import(/* webpackChunkName: "team-leader-settings-security" */ '../views/TeamLeader/Settings/Security.vue'),
            meta: {
              icon: 'mdi-security',
              layout: 'team-leader',
              middleware: []
            }
          }
        ],
        beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
          // todo: Solve the question of how we will change the locale
          loadLanguageAsync('ru', 'settings').then(() => next())
        },
        meta: {
          layout: 'team-leader',
          middleware: []
        }
      }
    ],
    meta: {
      anonymous: true,
      layout: 'team-leader',
      middleware: [roleTeamLeader]
    },
    beforeEnter (to: Route, from: Route, next: NavigationGuardNext) {
      // todo: Solve the question of how we will change the locale
      store.dispatch('system/roles').then()
      loadLanguageAsync('ru', 'team-leader').then(() => next())
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

const timer = new Timer()

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
  timer.reset()
  timer.start()
  if (app) {
    if (to.name !== from.name) {
      app.$root.$emit('root-loading-data-show')
    }
  }

  if (to.path === '/') {
    if (store.getters['profile/role_is_team_leader']) {
      return next({ name: 'team_leader' })
    }
    if (store.getters['profile/role_is_leader_cc']) {
      return next({ name: 'call_center_manager' })
    }
    if (store.getters['profile/role_is_admin']) {
      return next({ name: 'administrator' })
    }

    return next('/operator')
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

router.afterEach((to, from) => {
  timer.stop()

  if (to.name !== from.name) {
    if (timer.diff() < 800) {
      setTimeout(() => {
        app.$root.$emit('root-loading-data-hide')
      }, 800)
    } else {
      app.$root.$emit('root-loading-data-hide')
    }
  }
})

export default router

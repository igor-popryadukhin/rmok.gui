import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import { NavigationGuardNext } from 'vue-router/types/router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      layout: 'default',
      title: 'documents',
      breadcrumbs: [
        { name: 'dashboard', link: '/', class: '' },
        { name: 'documents', link: '/documents', class: '' }
      ],
      middleware: []
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      layout: 'clean',
      title: 'login',
      breadcrumbs: [],
      middleware: []
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      layout: 'default',
      title: 'documents',
      breadcrumbs: [
        { name: 'dashboard', link: '/', class: '' },
        { name: 'documents', link: '/documents', class: '' }
      ],
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

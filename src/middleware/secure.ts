import { MiddlewareContextInterface } from '@/router'

export default function (context: MiddlewareContextInterface) {
  if (/^\/administrator/s.test(context.to.path) && context.store.getters['profile/role_use'] === 'for_administration') {
    return context.next()
  } else if (/^\/operator/s.test(context.to.path) && context.store.getters['profile/role_use'] === 'for_calls') {
    return context.next()
  } else {
    if (context.to.name === 'access_denied') {
      return context.next()
    }

    if (context.to.name === 'login') {
      return context.next()
    }
    return context.next({ name: 'access_denied' })
  }
}

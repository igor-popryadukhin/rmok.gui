import { MiddlewareContextInterface } from '@/router'

export default function (context: MiddlewareContextInterface) {
  if (/^\/administrator/s.test(context.to.path) && context.store.getters['profile/role_use'] !== 'for_administration') {
    // Если не администратор и пытаешься пройти по маршруту администратора
    return context.next({ name: 'access_denied' })
  } else if (/^\/operator/s.test(context.to.path) && context.store.getters['profile/role_use'] !== 'for_calls') {
    // Если не оператор и пытаешься пройти по маршруту для операторов
    return context.next({ name: 'access_denied' })
  } else {
    return context.next()
  }
}

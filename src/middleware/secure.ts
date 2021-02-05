import { MiddlewareContextInterface } from '@/router'

export default function (context: MiddlewareContextInterface): void {
  if (!context.store.getters['profile/role_is_admin']) {
    // Запретить ходить по следующим маршрутам если не админ
    if (/^\/administrator\/organizations/s.test(context.to.path)) {
      return context.next({ name: 'access_denied' })
    }
  }
  context.next()
}

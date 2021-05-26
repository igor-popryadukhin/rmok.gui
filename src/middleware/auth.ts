import { MiddlewareContextInterface } from '@/router'

export default function auth (context: MiddlewareContextInterface) {
  // if(condition) {
  //   return next({
  //     name: 'login'
  //   })
  // }

  return context.next()
}

import { MiddlewareContextInterface } from '@/router'

export default function (context: MiddlewareContextInterface): void {
  context.next()
}

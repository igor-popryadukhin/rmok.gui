import { MiddlewareContextInterface } from '@/router'
import { Account } from '@/api/Account'

const account: Account = new Account()

export default function (context: MiddlewareContextInterface) {
  account.isRole('r_leader_cc').then((result) => { result ? context.next() : context.next({ name: 'access_denied' }) })
}

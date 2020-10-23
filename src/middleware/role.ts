import { MiddlewareContextInterface } from '@/router'
import { Account } from '@/api/Account'

const account: Account = new Account()

export default function role (context: MiddlewareContextInterface) {
  account.isRole('admin').then((result) => { result ? context.next() : context.next({ name: 'access_denied' }) })
}

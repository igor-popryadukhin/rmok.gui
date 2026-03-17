import { MiddlewareContextInterface } from '@/router';

export default function (context: MiddlewareContextInterface) {
  if (process.env.NODE_ENV === 'development') {
    return context.next();
  }

  return context.next({ name: 'access_denied' });
}

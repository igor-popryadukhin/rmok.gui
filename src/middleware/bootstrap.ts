import { MiddlewareContextInterface } from '@/router';
import debug from 'debug';
const appDebug = debug('app');

export default async function bootstraps (context: MiddlewareContextInterface) {
  if (context.store.getters['is_logged_in']) {
    context.next();
  } else {
    appDebug('Bootstrap loading...');
    context.store.commit('bootstrap_process', true);
    await context.store.dispatch('profile/fetch')
      .then(() => {
        appDebug('Bootstrap loading complete');
        setTimeout(() => (context.store.commit('is_logged_in', true)), 0);
        context.next();
      }).catch((reason: Error) => {
        appDebug('Bootstrap loading failure %o', reason);
        context.next({ name: 'login' });
      }).finally(() => {
        context.store.commit('bootstrap_process', false);
      });
  }
}

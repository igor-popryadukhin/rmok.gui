import Vue from 'vue';
import 'vue-class-component/hooks'; // import hooks type to enable auto-complete
import App from '@/App.vue';
import $router from '@/router';
import $store from '@/store';
import '@/directives';
// @see https://stackoverflow.com/questions/52122011/failed-to-execute-postmessage-on-window-googletagmanager
import './fix.postMessage';

// Style
import '@/assets/scss/style.scss';

// Plugins
import i18n, { loadLanguageAsync } from '@/plugins/i18n';
import vuetify from '@/plugins/vuetify';
import '@/plugins/string';
import '@/plugins/axios';
import '@/plugins/debug';
import '@/plugins/toast';
import '@/plugins/cookie';
import '@/plugins/router-query';
import '@/plugins/ifvisible';
import '@/plugins/account-monitoring';
import '@/plugins/dialer';
import '@/plugins/file-dialog';
import '@/plugins/lvovich';
import '@/plugins/vuetify-dialog';
import '@/plugins/html-audio-element';
import '@/plugins/vue-meta';
import '@/plugins/dayjs';
import '@/plugins/audio';
import '@/plugins/monitoring';
// import '@/plugins/devtools'

import CleanLayout from '@/layouts/Clean.vue';

// layouts
Vue.component('Default', () => import(/* webpackPreload: true */ '@/layouts/Default.vue'));
Vue.component('Clean', CleanLayout);
Vue.component('Help', () => import(/* webpackPreload: true */ '@/layouts/Help.vue'));

Vue.component('AppTooltip', () => import(/* webpackPreload: true */ '@/components/AppTooltip/AppTooltip.vue'));
Vue.component('AppDivider', () => import(/* webpackPreload: true */ '@/components/AppDivider/AppDivider.vue'));
Vue.component('AppTools', () => import(/* webpackPreload: true */ './components/AppTools/AppTools.vue'));
Vue.component('AppToolsRight', () => import(/* webpackPreload: true */ '@/components/AppTools/AppToolsRight.vue'));
Vue.component('AppToolsLeft', () => import(/* webpackPreload: true */ '@/components/AppTools/AppToolsLeft.vue'));

Vue.config.productionTip = false;

loadLanguageAsync('ru', 'main').then();

const $app: Vue = new Vue({
  i18n,
  created () {
    const html = document.documentElement;
    html.setAttribute('lang', 'ru');
  },
  render: (h) => h(App),
  router: $router,
  store: $store,
  vuetify
}).$mount('#app');

$router.beforeEach((to, from, next) => {
  $app.$root.$emit('router:before:each', { to, from });
  next();
});

$router.afterEach((to, from) => {
  $app.$root.$emit('router:after:each', { to, from });
});

export default $app;

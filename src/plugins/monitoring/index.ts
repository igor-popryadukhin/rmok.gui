import Monitoring from './src/Monitoring';
import Vue from 'vue';

const ws = new Monitoring();

Vue.use({
  install () {
    Object.defineProperties(Vue.prototype, {
      $monitoring: {
        get (): Monitoring {
          return ws;
        }
      }
    });

    Vue.observable(ws);
  }
});

import Vue from 'vue';
import IfVisible from './IfVisible';

const ifvisible = new IfVisible();

Vue.use({
  install () {
    Object.defineProperties(Vue.prototype, {
      $ifvisible: {
        get (): IfVisible {
          return ifvisible;
        }
      }
    });

    Vue.observable(ifvisible);
  }
});

export const $ifvisible = ifvisible;

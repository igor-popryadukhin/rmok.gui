import Vue from 'vue';
import Str from './Str';

const string = new Str();

Vue.use({
  install () {
    Object.defineProperties(Vue.prototype, {
      $string: {
        get (): Str {
          return string;
        }
      }
    });
  }
});

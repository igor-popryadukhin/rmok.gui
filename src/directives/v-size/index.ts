import Vue from 'vue';

const options = { passive: false };

let callback: any = null;
const eventHandler = function (arg: any) {
  if (typeof eventHandler === 'function') {
    callback(arg);
  }
};

Vue.directive('size', {

  inserted (el, binding) {
    callback = binding.value!;
    el.addEventListener('resize', eventHandler, options);
    callback(el.clientWidth);
  },

  unbind (el, binding) {
    el.removeEventListener('resize', eventHandler);
  }
});

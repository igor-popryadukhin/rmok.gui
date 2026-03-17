import Vue from 'vue';

const mixin = Vue.extend({
  props: {
    outlined: {
      type: Boolean,
      default: () => false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
});

export default mixin;

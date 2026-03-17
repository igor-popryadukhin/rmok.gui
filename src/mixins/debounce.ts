import Vue from 'vue';
import debounce from '@/utils/debounce';

const mixin = Vue.extend({
  methods: {
    debounce (fn: CallableFunction, delay: number): CallableFunction {
      return debounce(fn, delay);
    }
  }
});

export default mixin;

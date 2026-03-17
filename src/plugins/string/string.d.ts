import Vue from 'vue';
import Str from './Str';
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue

  interface Vue {
    $string: Str;
  }

  interface VueConstructor {
    $string: Str;
  }
}

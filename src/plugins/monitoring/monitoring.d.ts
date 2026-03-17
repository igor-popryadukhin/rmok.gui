import Vue from 'vue';
import Monitoring from './src/Monitoring';

declare module 'vue/types/vue' {
  interface Vue {
    $monitoring: Monitoring;
  }

  interface VueConstructor {
    $monitoring: Monitoring;
  }
}

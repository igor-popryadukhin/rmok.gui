import Ws from './src/Ws'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $ws: Ws;
  }

  interface VueConstructor {
    $ws: Ws;
  }
}

import Vue from 'vue'
import Dialer from '@/plugins/dialer/Dialer'

declare module 'vue/types/vue' {
  // 3. Объявите расширение для Vue
  interface Vue {
    $dialer: Dialer;
  }
}

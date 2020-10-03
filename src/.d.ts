// 1. Make sure to import 'vue' before declaring augmented types
import { NotifyInterface } from '@/notify';
import { Store } from 'vuex/types';
import { Cookie } from '@/plugins/cookie';

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue

  interface VueConstructor  {
    $screenHeight: number;
    $locale: string;
    $cookie: Cookie;
  }
}


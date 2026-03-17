import Vue from 'vue';
import { AxiosInstance } from 'axios';
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue

  interface Vue {
    $axios: AxiosInstance;
  }

  interface VueConstructor {
    $axios: AxiosInstance;
  }
}

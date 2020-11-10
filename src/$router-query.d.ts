// 1. Обязательно импортируйте Vue перед объявлением расширенных типов
import Vue from 'vue'
import { RouterQuery } from '@/plugins/router-query'

// 2. Укажите файл с типами, которые вы хотите расширить
//    Vue имеет тип конструктора в types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Объявите расширение для Vue
  interface Vue {
    $routerQuery: RouterQuery
  }
}

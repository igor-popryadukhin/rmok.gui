// 1. Make sure to import 'vue' before declaring augmented types
import { Cookie } from './plugins/cookie'
import { LibPhoneNumberJs } from '@/plugins/libphonenumber-js'
import { Lvovich } from '@/plugins/lvovich'
import { RouterQuery } from '@/plugins/router-query'

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue

  interface Vue  {
    $screenHeight: number
    $locale: string
    $cookie: Cookie
    $libPhoneNumberJs: LibPhoneNumberJs
    $lvovich: Lvovich,
    setQuery: (query: any) => void
    $routerQuery: RouterQuery
    $isDebug: boolean
  }
}

declare module 'vuescroll/dist/vuescroll-native'

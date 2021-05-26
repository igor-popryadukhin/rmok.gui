// 1. Make sure to import 'vue' before declaring augmented types
import { JsSIP } from '@/jsSIP/plugin'
import { Activity } from '@/plugins/activity'
import { AxiosInstance } from 'axios'
import moment, {Moment} from 'moment'
import { Cookie } from './plugins/cookie'
import { LibPhoneNumberJs } from '@/plugins/libphonenumber-js'
import { Lvovich } from '@/plugins/lvovich'
import { RouterQuery } from '@/plugins/router-query'
import { Permission } from '@/plugins/permission'

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue

  interface Vue  {
    /**
     * Метод Window.confirm() отображает модальное диалоговое окно с дополнительным сообщением и двумя кнопками: OK и Отмена.
     */
    $confirm: () => boolean,
    $screenHeight: number
    $screenWidth: number
    $headerHeight: number
    $locale: string
    $cookie: Cookie
    $libPhoneNumberJs: LibPhoneNumberJs
    $lvovich: Lvovich,
    setQuery: (query: any) => void
    $routerQuery: RouterQuery
    $isDebug: boolean
    $permission: Permission
    $activity: Activity
    $jsSIP: JsSIP;
    $axios: AxiosInstance;
    $moment: (inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean) => Moment;
    $htmlAudioElement: HTMLAudioElement,
    assertObjectHasAttribute (obj: any, key: string): boolean
  }

  interface VueConstructor {
    $confirm: () => boolean,
    $moment: (inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean) => Moment;
    $jsSIP: JsSIP;
    $myGlobal: string;
    $htmlAudioElement: HTMLAudioElement;
  }
}

declare module 'vuescroll/dist/vuescroll-native'

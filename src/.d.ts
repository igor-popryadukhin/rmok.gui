// 1. Make sure to import 'vue' before declaring augmented types
import { JsSIP } from '@/jsSIP/plugin'
import { Activity } from '@/plugins/activity'
import { ProfileState } from '@/store/profile/state'
import { AxiosInstance } from 'axios'
import { Debugger } from 'debug'
import { Cookie } from './plugins/cookie'
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
    $confirm: () => boolean;
    $screenHeight: number;
    $screenWidth: number;
    $headerHeight: number;
    $locale: string;
    $cookie: Cookie;
    $libPhoneNumberJs: LibPhoneNumberJs;
    $lvovich: Lvovich;
    setQuery: (query: any) => void;
    $routerQuery: RouterQuery;
    $isDebug: boolean;
    $permission: Permission;
    $activity: Activity
    $jsSIP: JsSIP;
    $axios: AxiosInstance;
    $htmlAudioElement: HTMLAudioElement;
    $version: string;
    $profile: ProfileState;
    $settings_vue_keep_alive: boolean;
    $appDebug: Debugger
    // Методы
    $isGranted (value: string | string[], strict = false): boolean;
    $consoleLog (message?: any, ...optionalParams: any[]);

    /**
     * @deprecated
     * @param obj
     * @param key
     */
    assertObjectHasAttribute (obj: any, key: string): boolean;
  }

  interface VueConstructor {
    $confirm: () => boolean;
    $jsSIP: JsSIP;
    $myGlobal: string;
    $htmlAudioElement: HTMLAudioElement;
    $version: string;
    $profile: ProfileState;
    $appDebug: Debugger
    // Методы
    $isGranted: (roles: string | string[], strategy: 'affirmative' | 'unanimous' = 'affirmative') => boolean;
    $settings_vue_keep_alive: boolean;
    $consoleLog (message?: any, ...optionalParams: any[]): void;
  }
}

declare module 'vuescroll/dist/vuescroll-native'
declare module 'petrovich'
declare module 'vuetify/lib/locale/ru'

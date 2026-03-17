import { Credentials, RTCConfiguration } from '@/api/interfaces/PBXConfiguration';
import { ProfileState } from '@/store/profile/state';
import Vue from 'vue';
import { version } from '../package.json';

export default class AppBase extends Vue {
  currentUserStatus = null

  get $profile (): ProfileState { return this.$store.state.profile; }
  get $profilePBXCredentials (): Credentials { return this.$store.getters['profile/pbx_configuration_credentials']; }
  get $profileRTCConfiguration (): RTCConfiguration { return this.$store.getters['profile/pbx_configuration_rtc_configuration']; }

  /**
   * Уникальный идентификатор вкладки
   */
  get $currentTabID (): string {
    return sessionStorage.tabID || '';
  }

  get $isDev (): boolean {
    return process.env.NODE_ENV === 'development';
  }

  get $projectVersion () {
    return version;
  }

  /**
   * Высота окна
   */
  get screenHeight (): number {
    return this.$vuetify.breakpoint.height;
  }

  /**
   * Ширина окна
   */
  get screenWidth (): number {
    return this.$vuetify.breakpoint.width;
  }

  get accountRoles () {
    return this.$store.getters['profile/roles'];
  }

  get navigationDrawerWidth (): number { return this.$store.getters['settings/navigation_drawer_width']; }
  get containerWidth (): number { return this.$store.getters['settings/container_width']; }

  /**
   * Проверяет наличие разрешений
   *
   * @param value
   */
  public $isGranted (value: string | string[]): boolean {
    if (Array.isArray(value)) {
      let granted = false;

      for (const role1 of this.accountRoles) {
        for (const role2 of value) {
          if (!granted) {
            granted = role1 === role2;
          }
        }
      }

      return granted;
    }

    return this.accountRoles.includes(value);
  }

  /**
   * Указывает браузеру отобразить диалоговое окно с дополнительным сообщением и дождаться,
   * пока пользователь не подтвердит или не отменит диалоговое окно.
   * При некоторых условиях - например, когда пользователь переключает
   * вкладки - браузер может фактически не отображать диалоговое окно или
   * может не ждать, пока пользователь подтвердит или отменит диалоговое окно.
   */
  public $confirm (message = 'Do you really want to leave? you have unsaved changes!') {
    return window.confirm(this.$tc(message));
  }

  public $confirmBeforeunload (message = 'Do you really want to leave? you have unsaved changes!') {
    window.onbeforeunload = (ev: BeforeUnloadEvent) => {
      if (typeof ev === 'undefined') {
        ev = window.event;
      }
      if (ev) {
        ev.returnValue = this.$tc(message);
      }
      return this.$tc(message);
    };
  }

  public $confirmBeforeunloadFlush (): void {
    window.onbeforeunload = null;
  }

  public userStatusUpdate (status: string) {
    if (status === this.currentUserStatus) {
      return;
    }

    this.currentUserStatus = status;

    if (this.$monitoring.connected && !this.$isGranted(['ROLE_ADMIN', 'ROLE_CCM', 'ROLE_TEAM_LEADER'])) {
      this.$monitoring.emit('user:status_changed', {
        status,
        datetime: this.$dayjs().toISOString()
      });
    }
  }
}

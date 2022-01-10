import Vue from 'vue'

export default class AppBase extends Vue {
  /**
   * Уникальный идентификатор вкладки
   */
  get $currentTabID (): string {
    return sessionStorage.tabID || ''
  }

  get $isDev (): boolean {
    return process.env.NODE_ENV === 'development'
  }

  /**
   * Высота окна
   */
  get screenHeight (): number {
    return this.$vuetify.breakpoint.height
  }

  /**
   * Ширина окна
   */
  get screenWidth (): number {
    return this.$vuetify.breakpoint.width
  }

  get accountPermissions () {
    return (this.$store.getters['profile/permissions'] || [])
      .filter((value) => value.granted)
      .map((value) => value.id)
  }

  get navigationDrawerWidth (): number { return this.$store.getters['settings/navigation_drawer_width'] }
  get containerWidth (): number { return this.$store.getters['settings/container_width'] }

  /**
   * Проверяет наличие разрешений
   *
   * @param value
   */
  public $isGranted (value: string | string[]): boolean {
    const rolesAvailable: string[] = this.accountPermissions
    if (Array.isArray(value)) {
      let granted = false

      for (const role1 of rolesAvailable) {
        for (const role2 of value) {
          if (!granted) {
            granted = role1 === role2
          }
        }
      }

      return granted
    }

    return rolesAvailable.includes(value)
  }

  /**
   * Указывает браузеру отобразить диалоговое окно с дополнительным сообщением и дождаться,
   * пока пользователь не подтвердит или не отменит диалоговое окно.
   * При некоторых условиях - например, когда пользователь переключает
   * вкладки - браузер может фактически не отображать диалоговое окно или
   * может не ждать, пока пользователь подтвердит или отменит диалоговое окно.
   */
  public $confirm (message = 'Do you really want to leave? you have unsaved changes!') {
    return window.confirm(this.$tc(message))
  }

  public $confirmBeforeunload (message = 'Do you really want to leave? you have unsaved changes!') {
    window.onbeforeunload = (ev: BeforeUnloadEvent) => {
      if (typeof ev === 'undefined') {
        ev = window.event
      }
      if (ev) {
        ev.returnValue = this.$tc(message)
      }
      return this.$tc(message)
    }
  }

  public $confirmBeforeunloadFlush (): void {
    window.onbeforeunload = null
  }
}

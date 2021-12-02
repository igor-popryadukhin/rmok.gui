import Vue from 'vue'

export default class AppBase extends Vue {
  get profileRolePermissions () { return this.$store.getters['profile/role/permissions'] }

  /**
   * Проверяет наличие разрешений
   *
   * @param value
   */
  public $isGranted (value: string | string[]): boolean {
    const rolesAvailable: string[] = this.profileRolePermissions
    if (Array.isArray(value)) {
      let granted = false

      for (const role1 of rolesAvailable) {
        for (const role2 of value) {
          if (!granted) { granted = role1 === role2 }
        }
      }

      return granted
    }

    return rolesAvailable.includes(value)
  }
}

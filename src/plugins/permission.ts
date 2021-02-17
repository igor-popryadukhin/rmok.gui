import store from '@/store'
import Vue from 'vue'

enum StrategyEnum {
  AFFIRMATIVE = 'affirmative',
  CONSENSUS = 'consensus',
  UNANIMOUS = 'unanimous',
  PRIORITY = 'priority'
}

export class Permission {
  private _permissions: string[];
  private _isSuperAdmin: boolean;

  /**
   *
   * @param permissions
   * @param isSuperAdmin
   */
  constructor (permissions: string[], isSuperAdmin = false) {
    this._permissions = permissions
    this._isSuperAdmin = isSuperAdmin
  }

  public initialize (permissions: string[], isSuperAdmin = false): void {
    this._permissions = permissions
    this._isSuperAdmin = isSuperAdmin
  }

  public isGranted (attribute: string[], strategy = StrategyEnum.AFFIRMATIVE): boolean {
    switch (strategy) {
      case StrategyEnum.AFFIRMATIVE: return this.isAffirmative(attribute)
      case StrategyEnum.PRIORITY: return this.isAffirmative(attribute)
      case StrategyEnum.UNANIMOUS: return this.isAffirmative(attribute)
      case StrategyEnum.CONSENSUS: return this.isAffirmative(attribute)
      default: {
        throw new Error('Invalid granted strategy')
      }
    }
  }

  public isSuperAdmin (): boolean {
    return this._isSuperAdmin
  }

  private isAffirmative (attribute: string[]): boolean {
    for (let i = 0; i < attribute.length; i++) {
      if (this._permissions.includes(attribute[i])) {
        return true
      }
    }
    return false
  }
}

const permission: Permission = new Permission(store.getters['profile/permissions'], store.getters['profile/super_admin'])

class PermissionPlugin {
  public install () {
    Object.defineProperties(Vue.prototype, {
      $permission: {
        get (): Permission {
          $permission.initialize(store.getters['profile/permissions'], store.getters['profile/super_admin'])
          return permission
        }
      }
    })

    Vue.observable($permission)
  }
}

Vue.use(new PermissionPlugin())

export const $permission: Permission = permission

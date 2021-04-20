import Vue from 'vue'
import { VueRouter } from 'vue-router/types/router'
import router from '@/router'

export class RouterQuery {
  private _vueRouter: VueRouter

  constructor (router: VueRouter) {
    this._vueRouter = router
  }

  /**
   * @param query
   */
  public setQuery (query: any): Promise<any> {
    return new Promise<void>((resolve) => {
      const obj = Object.assign({}, this._vueRouter.currentRoute.query)

      Object.keys(query).forEach((key: string) => {
        const value = query[key]
        if (value) {
          obj[key] = value
        } else {
          delete obj[key]
        }
      })

      this._vueRouter.push({
        params: this._vueRouter.currentRoute.params,
        path: this._vueRouter.currentRoute.path,
        query: obj
      }).catch((reason) => {
        return reason
      }).finally(resolve)
    })
  }

  /**
   * @param key
   * @param def
   */
  public getQuery<T = string | number> (key: string, def?: T): T {
    if (key in this._vueRouter.currentRoute.query) {
      const val: any = this._vueRouter.currentRoute.query[key]
      return val
    } else {
      return def as any
    }
  }

  /**
   * @param names
   */
  public removeQuery (names: string[]) {
    return new Promise<void>((resolve) => {
      const obj = Object.assign({}, this._vueRouter.currentRoute.query)

      names.forEach((key) => {
        delete obj[key]
      })

      this._vueRouter.push({
        params: this._vueRouter.currentRoute.params,
        path: this._vueRouter.currentRoute.path,
        query: obj
      }).catch((reason) => {
        return false
      }).finally(resolve)
    })
  }

  /**
   *
   * @param key
   */
  public hasQuery (key: string): boolean {
    return key in this._vueRouter.currentRoute.query
  }
}

const routerQuery: RouterQuery = new RouterQuery(router)

// tslint:disable-next-line:max-classes-per-file
class RouterQueryPlugin {
  public install () {
    Object.defineProperties(Vue.prototype, {
      $routerQuery: {
        get (): RouterQuery {
          return routerQuery
        }
      }
    })
  }
}

Vue.use(new RouterQueryPlugin())

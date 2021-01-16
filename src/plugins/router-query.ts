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
  setQuery (query: any): Promise<any> {
    return new Promise((resolve) => {
      const obj = Object.assign({}, this._vueRouter.currentRoute.query)

      Object.keys(query).forEach((key: string) => {
        const value = query[key]
        if (value) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          obj[key] = value
        } else {
          delete obj[key]
        }
      })

      this._vueRouter.push({
        path: this._vueRouter.currentRoute.path,
        params: this._vueRouter.currentRoute.params,
        query: obj
      }).catch((reason) => {
        console.log(reason)
      }).finally(resolve)
    })
  }

  /**
   * @param key
   * @param def
   */
  public getQuery (key: string, def: string | number): string | number {
    if (key in this._vueRouter.currentRoute.query) {
      const val: any = this._vueRouter.currentRoute.query[key]
      return typeof val === 'number' ? +val : String(this._vueRouter.currentRoute.query[key])
    } else {
      return typeof def === 'number' ? +def : String(def)
    }
  }

  /**
   * @param names
   */
  public removeQuery (names: string[]) {
    return new Promise((resolve) => {
      const obj = Object.assign({}, this._vueRouter.currentRoute.query)

      names.forEach((key) => {
        delete obj[key]
      })

      this._vueRouter.push({
        path: this._vueRouter.currentRoute.path,
        params: this._vueRouter.currentRoute.params,
        query: obj
      }).catch((reason) => {
        console.log(reason)
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

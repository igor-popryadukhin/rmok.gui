import Vue from 'vue'
import { VueRouter } from 'vue-router/types/router'
import router from '@/router'

interface QueryInterface {
  [key: string]: string | number
}

export class RouterQuery {
  private _vueRouter: VueRouter

  constructor (router: VueRouter) {
    this._vueRouter = router
  }

  /**
   * @param query
   */
  public setQuery (query: QueryInterface) {
    return new Promise((resolve) => {
      const obj = Object.assign({}, this._vueRouter.currentRoute.query)

      Object.keys(query).forEach((key: string) => {
        const value = query[key]
        if (value) {
          obj[key] = value
        } else {
          delete obj[key]
        }
      })

      this._vueRouter.replace({
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
  public getQuery (key: string, def: string | number): string {
    if (key in this._vueRouter.currentRoute.query) {
      return String(this._vueRouter.currentRoute.query[key])
    } else {
      return String(def)
    }
  }

  /**
   * @param queryNameArray
   * @param exceptQueryNameArray
   */
  public removeQuery (queryNameArray = [], exceptQueryNameArray = []) {
    return new Promise((resolve) => {
      const obj: any = {}

      if (queryNameArray.length > 0) {
        queryNameArray.forEach((key: any) => {
          obj[key] = null
        })
      } else {
        const query = this._vueRouter.currentRoute.query
        for (const key in query) {
          if (exceptQueryNameArray.findIndex((e: any) => e === key) === -1) { delete this._vueRouter.currentRoute.query[key] }
        }
      }
      this.setQuery(obj).finally(resolve)
    })
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

import AppBase from '@/AppBase'
import Component from 'vue-class-component'
import { Route } from 'vue-router'

@Component
export default class Base extends AppBase {
  public fetchTasks (append = false) {
    this.$store.dispatch(this.getVuexModuleNamespace(this.$route) + '/list/fetch', append)
  }

  /**
   * Процесс получения задач
   */
  get itemsFetching (): boolean {
    return this.$store.getters[this.getVuexModuleNamespace(this.$route) + '/list/items_fetching']
  }

  public getVuexModuleNamespace (route: Route) {
    return 'tasks_' + route.params.id
  }
}

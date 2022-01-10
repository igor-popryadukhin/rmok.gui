import AppBase from '@/AppBase'
import Component from 'vue-class-component'

@Component
export default class TasksBase extends AppBase {
  get vuexModuleNamespace (): string { return 'tasks/' + this.$route.params.id }

  public fetchTasks () {
    this.$store.dispatch(this.vuexModuleNamespace + '/list/fetch')
  }
}

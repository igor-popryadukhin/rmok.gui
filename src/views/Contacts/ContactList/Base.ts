import AppBase from '@/AppBase'
import Component from 'vue-class-component'

@Component
export default class Base extends AppBase {
  get contactLoading (): boolean { return this.$store.getters['contacts/list/loading'] }
}

import AppBase from '@/AppBase'
import Component from 'vue-class-component'

@Component
export default class ContactsViewBase extends AppBase {
  get contactId (): number {
    return +this.$route.params.contact_id
  }
}

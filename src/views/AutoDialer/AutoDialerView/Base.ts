import Component from 'vue-class-component'
import { mapGetters } from 'vuex'
import AppBase from '@/AppBase'

@Component({
  computed: {
    ...mapGetters({
      autodialerName: 'autodialer/view/name',
      autodialerStatus: 'autodialer/view/status'
    })
  }
})
export default class Base extends AppBase {
  get paramsId (): number {
    return +this.$route.params.id
  }
}

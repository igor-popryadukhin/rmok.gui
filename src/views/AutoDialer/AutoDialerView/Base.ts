import Component from 'vue-class-component'
import Vue from 'vue'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      autodialerName: 'autodialer/view/name',
      autodialerStatus: 'autodialer/view/status'
    })
  }
})
export default class Base extends Vue {}

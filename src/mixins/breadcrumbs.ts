import Vue from 'vue'
import { CrumbInterface } from '@/Interfaces'

export default Vue.mixin(Vue.extend({
  computed: {
    breadcrumbs (): CrumbInterface[] {
      /* eslint-disable */
      const crumbs: CrumbInterface[]  = []
      if (this.$route.path !== '/') {
        crumbs.push({
          path: '/',
          name: 'home',
          title: this.$i18n.tc('route.home'),
          class: '',
          latest: false
        })
      }

      this.$route.matched.forEach((item: any, i: number, {length}) => {
        if (item.meta.anonymous) {
          return
        }
        const crumb: CrumbInterface = {
          class: '',
          name: item.name,
          path: item.path,
          title: '',
          latest: false
        }
        crumb.path = item.path
        crumb.title = this.$i18n.tc('route.' + (item.name || item.path.replace(/^\//s, '').replace(/\//s, '')))
        // is last item?
        if (i === length - 1) {
          crumb.class = 'is-active'
        }

        crumb.title = crumb.title.replace(/[/]/, '')
        crumbs.push(crumb)
      })
      if (crumbs.length > 1) {
        crumbs[crumbs.length - 1].latest = true
      }
      return crumbs
      /* eslint-enable */
    }
  }
}))

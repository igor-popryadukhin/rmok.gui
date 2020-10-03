import Vue from 'vue'

interface Crumb {
  title: string;
  path: string;
  class: string;
}

Vue.mixin({
  computed: {
    breadcrumbs (): Array<Crumb> {
      const crumbs: Array<any> = []
      // @ts-ignore
      this.$route.matched.map((item: any, i: number, { length }) => {
        const crumb: Crumb = {
          class: '',
          path: '',
          title: ''
        }
        crumb.path = item.path
        // @ts-ignore
        crumb.title = this.$i18n.t('route.' + (item.name || item.path.replace(/^\//s, '').replace(/\//s, '-')))
        // is last item?
        if (i === length - 1) {
          // is param route? .../.../:id
          if (item.regex.keys.length > 0) {
            crumbs.push({
              path: item.path.replace(/\/:[^/:]*$/, ''),
              // @ts-ignore
              title: this.$i18n.t('route.' + item.name.replace(/-[^-/]*$/, ''))
            })
            // @ts-ignore
            crumb.path = this.$route.path
            // @ts-ignore
            crumb.title = this.$i18n.t('route.' + this.$route.name, [
              // @ts-ignore
              crumb.path.match(/[/]*$/)[0]
            ])
          }
          crumb.class = 'is-active'
        }

        crumb.title = crumb.title.replace(/[/]/, '')
        crumbs.push(crumb)
      })
      return crumbs
    },
    breadcrumb_title () {
      // @ts-ignore
      if (this.breadcrumbs.length > 1) {
        // @ts-ignore
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        const crumb: Crumb = this.breadcrumbs.pop()
        // @ts-ignore
        return this.$t(crumb.title)
      }
      return ''
    }
  }
})

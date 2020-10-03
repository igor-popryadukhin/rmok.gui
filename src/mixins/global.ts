import Vue from 'vue'

Vue.mixin({
  computed: {
    $screenHeight () {
      /* eslint-disable */
      // @ts-ignore
      return this.$vuetify.breakpoint.height
      /* eslint-enable */
    },

    $locale (): string {
      return 'ru'
    }
  },

  methods: {
    /* eslint-disable */
    getQuery (key: string, def: any) {
      if (key in this.$route.query) {
        return this.$route.query[key]
      } else {
        return def
      }
    },
    setQuery (query?: Object) {
      const obj: Object|any = Object.assign({}, this.$route.query)

      // @ts-ignore
      Object.keys(query).forEach((key: string) => {
        // @ts-ignore
        const value = query[key]
        if (value) {
          obj[key] = value
        } else {
          delete obj[key]
        }
      })

      // @ts-ignore
      this.$router.replace({
        ...this.$router.currentRoute,
        query: obj
      })

      return this
    },
    removeQuery (queryNameArray = [], exceptQueryNameArray = []) {
      const obj: Object|any = {}

      if (queryNameArray.length > 0) {
        queryNameArray.forEach((key: any) => {
          obj[key] = null
        })
      } else {
        const query = this.$route.query
        for (const key in query) {
          if (exceptQueryNameArray.findIndex((e: any) => e === key) === -1) { delete this.$route.query[key] }
        }
      }
      // @ts-ignore
      this.setQuery(obj)
    }
    /* eslint-enable */
  }
})

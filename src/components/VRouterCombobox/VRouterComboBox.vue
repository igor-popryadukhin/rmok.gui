<template>
  <v-combobox
    dense
    item-text="name"
    item-value="name"
    :items="routes"
  >
    <template v-slot:item="scope">
      <slot name="item" v-bind="scope">
        <v-list-item
          v-on="scope.on"
          :to="scope.item"
        >
          {{ scope.item.name }}
        </v-list-item>
      </slot>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import Vue from 'vue'
import { Route } from 'vue-router'

export default Vue.extend({

  name: 'VRouterComboBox',

  props: {
    parentRouteName: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      routes: []
    }
  },

  created () {
    if (this.$router.options.routes) {
      this.$router.options.routes.forEach((e) => {
        this.tree(e, (r: any) => {
          // Call center manager settings
          if (r.name === this.parentRouteName) {
            r.children.forEach((router: Route) => {
              this.routes.push({
                name: this.$tc(router.name || ''),
                icon: router.meta.icon,
                disabled: false,
                to: router
              })
            })
          }
        })
      })
    }
  },

  methods: {
    tree (node: any, handler: (a: any) => void) {
      if (node.children) {
        node.children.forEach((e: any) => {
          this.tree(e, handler)
          handler(e)
        })
      }
    }
  }
})
</script>

<style scoped>

</style>

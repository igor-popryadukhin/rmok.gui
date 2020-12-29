<template>
  <v-combobox
    v-model="select"
    item-text="name"
    item-value="name"
    :items="routes"
    :disable-lookup="true"
    hide-details
    hide-selected
    outlined
    dense
    single-line
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
    <template v-slot:selection="scope">
      <slot name="selection" v-bind="scope">
        {{ scope.item.name }}
      </slot>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import Vue from 'vue'
import { Route } from 'vue-router'
import router from '@/router'

export default Vue.extend({

  name: 'VRouterComboBox',

  props: {
    patternRouteName: {
      type: [String, RegExp],
      required: true
    }
  },

  data () {
    return {
      select: null as any,
      routes: []
    }
  },

  created () {
    const tree = (node: Route, handler: (a: Route) => void) => {
      if (node.children) {
        node.children.forEach((e: Route) => {
          tree(e, handler)
        })
      } else {
        handler(node)
      }
    }

    this.select = this.$route
    const reg = new RegExp(this.patternRouteName)

    router.options.routes.forEach((e) => {
      tree(e, (route: Route) => {
        if (reg.test(route.name)) {
          this.routes.push({
            name: this.$tc(route.name || ''),
            icon: route.meta.icon,
            disabled: false,
            to: route
          })
        }
      })
    })
  }
})
</script>

<style scoped>

</style>

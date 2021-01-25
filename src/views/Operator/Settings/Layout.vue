<template>
  <div>
    <v-tabs vertical>
      <v-tab
        v-for="(tab, index) in tabs"
        :key="index"
        :to="tab.to"
        :disabled="tab.disabled"
      >
        <v-icon left>
          {{ tab.icon }}
        </v-icon>
        {{ $tc(`route.${tab.name}`) }}
        <v-spacer />
      </v-tab>
      <v-tabs-items class="pa-2 border">
        <router-view />
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Route } from 'vue-router'
import router from '@/router'

interface TabInterface {
  name: string;
  icon: string;
  disabled: boolean;
  to: string | Route;
}

export default Vue.extend({
  data () {
    return {
      tabs: [] as TabInterface[]
    }
  },

  created () {
    // Данная конструкция позволяет построить массив дочерних маршрутов, опираясь на имя родительского маршрута
    const tree = (node: Route, handler: (a: Route) => void) => {
      if (node.children) {
        node.children.forEach((e: Route) => {
          tree(e, handler)
        })
      } else {
        handler(node)
      }
    }

    router.options.routes.forEach((e) => {
      tree(e, (route: Route) => {
        if (/^operator_settings.*?$/.test(route.name)) {
          this.tabs.push({
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

<style lang="scss" scoped>
  .border {
    border-left: 2px #3A70D4 solid;
    margin-left: 5px;
  }
</style>

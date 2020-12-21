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
    if (router.options.routes) {
      router.options.routes.forEach((e) => {
        this.tree(e, (r: any) => {
          // Call center manager settings
          if (r.name === 'team_leader_settings') {
            r.children.forEach((router: Route) => {
              this.tabs.push({
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

<style lang="scss" scoped>
  .border {
    border-left: 2px #b729b1 solid;
    margin-left: 5px;
  }
</style>

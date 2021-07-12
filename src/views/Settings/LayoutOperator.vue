<template>
  <v-sheet>
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

      <v-divider />

      <v-tab
        v-if="project_available.length > 1"
        :disabled="tabChangeProjectDisabled"
        link
        @click="onChangeProjectClick"
      >
        <v-icon left>
          mdi-swap-horizontal-bold
        </v-icon>
        {{ $tc('Change project') }}
        <v-spacer />
      </v-tab>

      <v-tabs-items class="px-2 border">
        <router-view />
      </v-tabs-items>
    </v-tabs>
  </v-sheet>
</template>

<script lang="ts">
import Projects from '@/api/Projects'
import Vue from 'vue'
import { Route } from 'vue-router'
import router from '@/router'
import { mapGetters } from 'vuex'

interface TabInterface {
  name: string;
  icon: string;
  disabled: boolean;
  to: string | Route;
}

export default Vue.extend({
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
            disabled: false,
            icon: route.meta.icon,
            name: this.$tc(route.name || ''),
            to: route
          })
        }
      })
    })
  },

  data () {
    return {
      tabChangeProjectDisabled: false,
      tabs: [] as TabInterface[]
    }
  },

  computed: {
    ...mapGetters({
      project_available: 'project/available'
    })
  },

  methods: {
    onChangeProjectClick () {
      this.tabChangeProjectDisabled = true
      // Очищаю локальное хранилище
      this.$store.dispatch('project/clear')
      new Projects()
        .inactive()
        .then(() => {
          this.$router.replace({
            name: 'login'
          })
        })
    }
  }
})
</script>

<style lang="scss" scoped>
.border {
  border-left: 2px #3A70D4 solid;
  margin-left: 5px;
}
</style>

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
        <v-fade-transition hide-on-leave>
          <router-view />
        </v-fade-transition>
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
      tabs: [
        // {
        //   name: 'profile',
        //   icon: 'mdi-account-circle-outline',
        //   disabled: false,
        //   to: {
        //     name: 'profile'
        //   }
        // },
        // {
        //   name: 'journal',
        //   icon: 'mdi-history',
        //   disabled: false,
        //   to: {
        //     name: 'journal'
        //   }
        // },
        // {
        //   name: 'security',
        //   icon: 'mdi-security',
        //   disabled: false,
        //   to: {
        //     name: 'security'
        //   }
        // },
        // {
        //   name: 'telephony',
        //   icon: 'mdi-phone-voip',
        //   to: {
        //     name: 'telephony'
        //   }
        // },
        // {
        //   name: 'headset_configure',
        //   icon: 'mdi-headset',
        //   disabled: false,
        //   to: {
        //     name: 'headset_configure'
        //   }
        // },
        // {
        //   name: 'integration',
        //   icon: 'mdi-api',
        //   disabled: true,
        //   to: null
        // }
      ] as TabInterface[]
    }
  },

  created () {
    if (router.options.routes) {
      router.options.routes.forEach((e) => {
        this.tree(e, (r: any) => {
          // Admin settings
          if (r.name === 'administrator_settings') {
            r.children.forEach((router: Route) => {
              console.log(router.name)
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
    tree (node: any, handler: Function) {
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

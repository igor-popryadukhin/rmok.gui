<template>
  <v-sheet>
    <v-tabs
      vertical
    >
      <v-tab
        v-for="(tab, tabKey) in tabs"
        v-bind="tab.attrs"
        :key="tabKey"
      >
        {{ $tc(tab.title) }}
        <v-spacer />
      </v-tab>

      <v-tabs-items
        class="pa-2 pl-4 v-tabs-items__border"
        style="min-height: 500px"
      >
        <keep-alive>
          <router-view />
        </keep-alive>
      </v-tabs-items>
    </v-tabs>
  </v-sheet>
</template>

<script lang="ts">
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'

interface Refs {
  [key: string]: any;
}

interface Data {
  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $refs: Refs;
  $data: Data;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({

  data (): Data {
    return {
      tab: null
    }
  },

  computed: {
    tabs () {
      return [
        {
          title: 'Main information',
          attrs: {
            to: {
              name: 'users_edit_main'
            }
          }
        },
        {
          title: 'Telephony',
          attrs: {
            to: {
              name: 'users_edit_telephony'
            }
          }
        }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.v-tabs-items__border {
  border-left: 2px #3A70D4 solid;
  margin-left: 5px;
}
</style>

<template>
  <v-sheet>
    <v-tabs
      vertical
    >
      <v-tab
        v-for="(tab, tabKey) in tabs"
        v-bind="tab.attrs"
        :key="tabKey"
        class="tab"
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
import AppBase from '@/AppBase'
import Component from 'vue-class-component'

@Component({
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$store.dispatch('users_edit/fetch', to.params.user_id)
    })
  }
})
export default class UserEdit extends AppBase {
  tab = null

  get tabs () {
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
      },
      {
        title: 'Schedule',
        attrs: {
          to: {
            name: 'users_edit_schedule'
          }
        }
      },
      {
        title: 'Sessions',
        attrs: {
          to: {
            name: 'users_edit_sessions'
          }
        }
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
.tab {
  border-bottom: #e0e0e0 solid 1px;
}
.v-tabs-items__border {
  border-left: 2px #3A70D4 solid;
  margin-left: 5px;
}
</style>

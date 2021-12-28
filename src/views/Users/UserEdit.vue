<template>
  <v-sheet>
    <v-tabs
      vertical
    >
      <template v-for="(tab, tabKey) in tabs">
        <v-tab
          v-if="tab.visible"
          v-bind="tab.attrs"
          :key="tabKey"
          class="tab"
        >
          {{ $tc(tab.title) }}
          <v-spacer />
        </v-tab>
      </template>

      <v-tabs-items
        class="v-tabs-items__border pl-2"
        :style="tabsItemsStyle"
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

  get tabsItemsStyle () {
    return {
      height: `${this.screenHeight - 90}px`,
      'overflow-y': 'auto'
    }
  }

  get tabs () {
    return [
      {
        title: 'Main information',
        visible: true,
        attrs: {
          to: {
            name: 'users_edit_main'
          }
        }
      },
      {
        title: 'Telephony',
        visible: true,
        attrs: {
          to: {
            name: 'users_edit_telephony'
          }
        }
      },
      {
        title: 'Schedule',
        visible: this.$isGranted('USER_WORK_TIME_MANAGEMENT'),
        attrs: {
          to: {
            name: 'users_edit_schedule'
          }
        }
      },
      {
        title: 'Capabilities',
        visible: true,
        attrs: {
          to: {
            name: 'users_edit_capabilities'
          }
        }
      },
      {
        title: 'Sessions',
        visible: true,
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

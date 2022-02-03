<template>
  <v-sheet height="100%">
    <template v-if="loading">
      <div
        class="d-flex fill-height align-center justify-center"
      >
        <div class="grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="sessions.length === 0">
        <div
          class="d-flex fill-height align-center justify-center"
        >
          <div class="grey--text">
            {{ $tc('Empty') }}
          </div>
        </div>
      </template>
      <template v-else>
        <v-list
          dense
        >
          <template v-for="(item, key) in sessions">
            <v-list-item
              :key="key"
              link
            >
              <v-list-item-avatar>
                <v-icon v-if="item.browser.name === 'Chrome'">
                  mdi-google-chrome
                </v-icon>
                <v-icon v-else-if="item.browser.name === 'Opera'">
                  mdi-opera
                </v-icon>
                <v-icon v-else-if="item.browser.name === 'Microsoft Edge'">
                  mdi-microsoft-edge
                </v-icon>
                <v-icon v-else-if="item.browser.name === 'Safari'">
                  mdi-apple-safari
                </v-icon>
                <v-icon v-else-if="item.browser.name === 'Firefox'">
                  mdi-firefox
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.browser.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.browser.name }} {{ item.browser.version }} — {{ item.os.name }} {{ item.os.version }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action-text>
                {{ $dayjs(item.created_at * 1000).format('DD.MM.YYYY HH:mm:ss') }}
              </v-list-item-action-text>
            </v-list-item>
            <v-divider :key="`v-divider-${key}`" />
          </template>
        </v-list>
      </template>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import Component from 'vue-class-component'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppTable from '@/components/AppTable/AppTable.vue'

// eslint-disable-next-line no-use-before-define
@Component<UsersViewSessions>({
  components: { AppTable, AppLoading },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (vm.sessions.length === 0) {
        vm.loading = true
        vm.$store.dispatch('users/view/sessions/fetch')
          .finally(() => (vm.loading = false))
      }
    })
  }
})
export default class UsersViewSessions extends AppBase {
  loading = false

  get sessions () {
    return this.$store.getters['users/view/sessions/items']
  }
}
</script>

<style lang="scss" scoped>
.sessions-page {
  height: 100%;
}

.sessions-page__tabs {
  height: 35px;
}

.sessions-page__list {
  height: calc(100% - 35px);
  height: -moz-calc(100% - 35px);
  height: -webkit-calc(100% - 35px);

  overflow: auto;
}
</style>

<template>
  <v-sheet
    class="users-page"
    flat
    tile
  >
    <div class="users-page__tools mb-1">
      <div
        class="d-flex grow"
      >
        <v-btn
          text
          tile
          small
        >
          {{ $tc('Create') }}
        </v-btn>
        <v-btn
          text
          tile
          small
          @click="onBtnRefreshClick"
        >
          {{ $tc('Refresh') }}
        </v-btn>
      </div>
      <v-divider class="mt-1" />
      <div
        class="d-flex align-center py-4"
      >
        <v-text-field
          :label="$t('Search')"
          prepend-inner-icon="mdi-magnify"
          style="max-width: 250px"
          clearable
          outlined
          dense
          hide-details
        />
      </div>
    </div>

    <app-divider />

    <div class="users-page__list">
      <v-list class="mb-16">
        <template v-for="item in items">
          <v-list-item
            :key="'v-list-item-' + item.id"
            dense
            link
          >
            <v-list-item-avatar>
              <v-avatar
                v-if="item.userpic"
                class="primary white--text"
              >
                <v-img :src="item.userpic" />
                <v-badge
                  v-show="item.online"
                  offset-y="16"
                  offset-x="13"
                  color="#38ff00"
                  dot
                  bordered
                />
              </v-avatar>
              <v-avatar
                v-else
                class="primary white--text"
              >
                {{ item.abbreviation }}
              </v-avatar>
              <v-badge
                v-show="item.online"
                offset-y="16"
                offset-x="13"
                color="#38ff00"
                dot
                bordered
              />
            </v-list-item-avatar>
            <v-list-item-content
              class="py-0"
              style="width: 100px"
            >
              <v-list-item-title>
                {{ item.full_name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                @{{ item.login }}
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-if="item.last_activity_at"
                :key="`v-list-item-action-text-${item.id}`"
              >
                <!--                {{ unixToTimeAgo(item.last_activity_at) }}-->
              </v-list-item-subtitle>
            </v-list-item-content>

            <!-- Проект -->
            <v-list-item-content
              v-if="item.project"
              class="py-0"
            >
              <v-list-item-title>
                {{ item.project.name }}
              </v-list-item-title>
            </v-list-item-content>
            <!-- Проект -->

            <v-list-item-action>
              <v-btn
                :to="{ name: 'users_view', params: { id: item.id } }"
                small
                text
                tile
              >
                {{ $tc('Edit') }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider :key="'v-divider-' + item.id" />
        </template>
      </v-list>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import User from '@/api/interfaces/User'
import AppBase from '@/AppBase'
import AppNavigationDrawer from '@/components/AppNavigationDrawer/AppNavigationDrawer.vue'
import AppTable from '@/components/AppTable/AppTable.vue'
import Component from 'vue-class-component'
import AppLoading from '@/components/AppLoading/AppLoading.vue'

@Component({
  components: { AppNavigationDrawer, AppTable, AppLoading },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('users/list/fetch')
    })
  }
})
export default class Users extends AppBase {
  get itemsFetching (): boolean { return this.$store.getters['users/list/items_fetching'] }
  get items (): User[] { return this.$store.getters['users/list/items'] }

  async onBtnAddClick () {
    // TODO: Add
  }

  private onBtnRefreshClick () {
    this.$store.dispatch('users/list/fetch')
  }
}
</script>

<style lang="scss" scoped>
.users-page {
  height: 100%;
}

.users-page__tools {
  height: 100px;
  //display: flex;
  //flex-wrap: nowrap;
  //align-content: center;
  //align-items: center;
}

.v-toolbar-header div {
  padding: 0 !important;
}

.users-page__list {
  height: calc(100% - 100px);
  height: -moz-calc(100% - 100px);
  height: -webkit-calc(100% - 100px);

  overflow: auto;
}

</style>

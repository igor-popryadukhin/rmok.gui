<template>
  <v-sheet
    class="users-page"
    flat
    tile
  >
    <div class="users-page__tools mb-1">
      <div
        class="d-flex grow mb-1"
      >
        <v-btn
          :to="{ name: 'users_create' }"
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

      <v-divider />

      <div
        class="d-flex align-center py-1"
      >
        <v-text-field
          v-model="filterQ"
          :label="$t('Search')"
          prepend-inner-icon="mdi-magnify"
          style="max-width: 250px"
          clearable
          outlined
          dense
          hide-details
          @input="onFilterChange"
        />
        <v-spacer />
        <app-paginator
          v-model="filterOffset"
          :count="itemsTotal"
          :per-page="itemsPerPage"
          :disabled="itemsFetching"
          @click:btn="onFilterChange"
        />
      </div>
    </div>

    <app-divider :loading="itemsFetching && items.length > 0" />

    <div class="users-page__list">
      <div
        v-if="itemsFetching && items.length === 0"
        class="d-flex align-center justify-center fill-height"
      >
        <app-loading />
      </div>
      <div
        v-else-if="items.length === 0"
        class="d-flex align-center justify-center fill-height"
      >
        <span class="grey--text">
          {{ $tc('Nothing found.') }}
        </span>
      </div>
      <v-list
        v-else
        class="mb-16"
      >
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
import User from '@/api/interfaces/User';
import AppBase from '@/AppBase';
import AppNavigationDrawer from '@/components/AppNavigationDrawer/AppNavigationDrawer.vue';
import AppPaginator from '@/components/AppPagination/AppPaginator.vue';
import AppTable from '@/components/AppTable/AppTable.vue';
import debounce from '@/utils/debounce';
import Component from 'vue-class-component';
import AppLoading from '@/components/AppLoading/AppLoading.vue';

@Component({
  components: { AppPaginator, AppNavigationDrawer, AppTable, AppLoading },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$store.dispatch('users/list/fetch');
    });
  }
})
export default class Users extends AppBase {
  get itemsFetching (): boolean { return this.$store.getters['users/list/items_fetching']; }
  get itemsTotal (): number { return this.$store.getters['users/list/items_total']; }
  get itemsPerPage (): number { return this.$store.getters['users/list/items_per_page']; }
  get items (): User[] { return this.$store.getters['users/list/items']; }

  get filterOffset (): number { return this.$store.getters['users/list/filter_query']?.offset || 0; }
  set filterOffset (val: number) {
    const obj = JSON.parse(JSON.stringify(this.$store.getters['users/list/filter_query']));
    obj.offset = val;
    this.$store.commit('users/list/filter_query', obj);
  }

  get filterQ (): string { return this.$store.getters['users/list/filter_query']?.q || ''; }
  set filterQ (val: string) {
    const obj = JSON.parse(JSON.stringify(this.$store.getters['users/list/filter_query']));
    obj.q = val;
    this.$store.commit('users/list/filter_query', obj);
  }

  public created () {
    this.onFilterChange = debounce(this.onFilterChange, 350);
  }

  private onFilterChange () {
    this.$store.dispatch('users/list/fetch');
  }

  private onBtnRefreshClick () {
    this.$store.dispatch('users/list/fetch');
  }
}
</script>

<style lang="scss" scoped>
.users-page {
  height: 100%;
}

.users-page__tools {
  height: 77px;
  //display: flex;
  //flex-wrap: nowrap;
  //align-content: center;
  //align-items: center;
}

.v-toolbar-header div {
  padding: 0 !important;
}

.users-page__list {
  height: calc(100% - 77px);
  height: -moz-calc(100% - 77px);
  height: -webkit-calc(100% - 77px);

  overflow: auto;
}

</style>

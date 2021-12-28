<template>
  <v-sheet
    flat
    tile
  >
    <v-row>
      <v-col
        cols="12"
        md="9"
        lg="9"
      >
        <app-tools
          dense
          elevation="0"
          tile
        >
          <template #left>
            <v-btn
              to="create"
              text
              tile
              small
            >
              {{ $tc('Create') }}
            </v-btn>
            <v-btn
              :disabled="usersProcessLoading"
              text
              tile
              small
              @click="onButtonRefreshClick"
            >
              {{ $tc('Refresh') }}
            </v-btn>
          </template>
          <template #right>
            <app-pagination
              v-model="filterOffset"
              :per-page="50"
              :count="usersTotal"
            />
          </template>
        </app-tools>
        <v-divider />
        <small
          class="d-block grey--text"
          style="font-size: small"
        >
          {{ $tc('users_total_online', usersTotalOnline) }}
        </small>
        <template v-if="usersProcessLoading">
          <div
            class="d-flex align-center justify-center"
            style="height: 500px"
          >
            <div class="pa-16 grey--text">
              <app-loading />
            </div>
          </div>
        </template>
        <template v-else-if="usersItems.length === 0">
          <div
            class="d-flex align-center justify-center"
            style="height: 500px"
          >
            <div class="pa-16 grey--text">
              <template v-if="usersItemsMessageError">
                {{ usersItemsMessageError }}
              </template>
              <template v-else>
                {{ $tc('Empty') }}
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <v-list class="mb-16">
            <template v-for="item in usersItems">
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
                <v-list-item-content class="py-0">
                  <v-list-item-title>
                    {{ item.full_name }}
                  </v-list-item-title>
                  <v-list-item-subtitle
                    v-if="item.last_activity_at"
                    :key="`v-list-item-action-text-${item.id}-${tick}`"
                  >
                    {{ unixToTimeAgo(item.last_activity_at) }}
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
                    :to="{ name: 'users_edit_main', params: { user_id: item.id } }"
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
        </template>
      </v-col>

      <v-col
        class="pb-0"
        cols="12"
        md="3"
        lg="3"
      >
        <app-search-input
          v-model="filterQ"
          :label="$tc('Search')"
        />
        <app-project-autocomplete
          v-model="filterProjectId"
          :label="$tc('User\'s current project')"
        />
        <template>
          <app-user-group-autocomplete
            v-model="filterUserGroupId"
            :label="$tc('User group')"
            outlined
            dense
          />
        </template>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import { UserInterface } from '@/api/Users'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import { mapGetters } from 'vuex'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppProjectAutocomplete from '@/components/AppProjectAutocomplete/AppProjectAutocomplete.vue'
import AppSearchInput from '@/components/AppSearchInput/AppSearchInput.vue'
import AppUserGroupAutocomplete from '@/components/AppUserGroupAutocomplete/AppUserGroupAutocomplete.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'

interface Ref {
  [key: string]: any;
}

interface Data {
  [key: string]: any;
}

interface Methods {
  [key: string]: any;
}

interface Computed {
  [key: string]: any;
}

interface Props {
  [key: string]: any;
}

interface VInnerInterface extends VInterface {
  $data: Data;
  $refs: Ref;
}

export default (Vue as VueConstructor<VInnerInterface>).extend<Data, Methods, Computed, Props>({

  metaInfo: {
    title: 'Foo Bar'
  },

  components: {
    AppPagination,
    AppUserGroupAutocomplete,
    AppSearchInput,
    AppProjectAutocomplete,
    AppLoading
  },

  data (): Data {
    return {
      tick: 0,
      usersItemsMessageError: ''
    }
  },

  computed: {
    ...mapGetters({
      usersProcessLoading: 'users/process_loading',
      usersTotal: 'users/total',
      usersTotalOnline: 'users/total_online',
      usersItems: 'users/items',
      settingsDateTimeFormat: 'settings/date_time_format'
    }),

    filterQ: {
      get () {
        return this.$store.getters['users/params/filter_q']
      },

      set (val: string) {
        return this.$store.commit('users/params/filter_q', val)
      }
    },

    filterProjectId: {
      get () {
        return this.$store.getters['users/params/filter_project_id']
      },

      set (val: number) {
        return this.$store.commit('users/params/filter_project_id', val)
      }
    },

    filterUserGroupId: {
      get () {
        return this.$store.getters['users/params/filter_user_group_id']
      },

      set (val: number) {
        return this.$store.commit('users/params/filter_user_group_id', val)
      }
    },

    filterOffset: {
      get () {
        return this.$store.getters['users/params/filter_offset']
      },

      set (val: number) {
        return this.$store.commit('users/params/filter_offset', val)
      }
    }
  },

  created () {
    this.fetchUsers = debounce(this.fetchUsers, 450)
  },

  mounted () {
    if (this.usersItems.length === 0) {
      this.fetchUsers()
    }

    // Обновление время после
    setInterval(() => (this.tick++), 10000)

    this.$watch('filterQ', () => {
      this.filterOffset = 0
      this.fetchUsers()
    })
    this.$watch('filterProjectId', () => {
      this.filterOffset = 0
      this.fetchUsers()
    })
    this.$watch('filterUserGroupId', () => {
      this.filterOffset = 0
      this.fetchUsers()
    })
    this.$watch('filterOffset', () => (this.fetchUsers()))
  },

  methods: {
    fetchUsers () {
      this.$store
        .dispatch('users/items')
        .catch((e: Error) => {
          this.usersItemsMessageError = e.message
        })
    },

    onButtonRefreshClick () {
      this.fetchUsers()
    },

    /**
     * Срабатывает когда в списке "пользователи системы" нажали кнопу удалить пользователя
     * @param item Элемент массива UserInterface[]
     */
    onDelete (item: UserInterface) {
      // TODO: Реализовать обработчик
    },

    /**
     * Сколько времени назад.
     *
     * @param timestamp
     */
    unixToTimeAgo  (timestamp: number) {
      return this.$dayjs(timestamp * 1000).fromNow()
    }
  }
})
</script>

<style lang="scss" scoped>

.v-toolbar .v-toolbar__content {
  padding: 0 !important;
  background-color: #3a70d4 !important;
}

.v-dt-item {
  & > td {
    white-space: nowrap;
  }
}

.v-toolbar-header div {
  padding: 0 !important;
}

.v-toolbar-header div:last-child {
  margin-right: 10px;
}
</style>

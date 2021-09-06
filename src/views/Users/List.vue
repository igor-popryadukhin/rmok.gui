<template>
  <v-sheet
    flat
    tile
  >
    <v-row>
      <v-col
        class="py-0"
        cols="12"
        md="9"
        lg="9"
      >
        <v-toolbar
          dense
          elevation="0"
          tile
        >
          <v-btn
            v-if="$isGranted('USER_CREATE')"
            to="new"
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
          <v-spacer />
          <app-pagination
            v-model="filterOffset"
            :per-page="50"
            :count="usersTotal"
          />
        </v-toolbar>
        <app-divider />
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
                    v-if="$isGranted('USER_EDIT')"
                    :to="`${item.id}/main`"
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
        <template v-if="$isGranted(['ROLE_ADMIN', 'ROLE_RCC'])">
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
import { UserInterface, Users } from '@/api/Users'
import SUserDialogDelete from '@/snippets/SUserDialogDelete/SUserDialogDelete.vue'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import { mapActions, mapGetters } from 'vuex'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppProjectAutocomplete from '@/components/AppProjectAutocomplete/AppProjectAutocomplete.vue'
import AppSearchInput from '@/components/AppSearchInput/AppSearchInput.vue'
import AppUserGroupAutocomplete from '@/components/AppUserGroupAutocomplete/AppUserGroupAutocomplete.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'

interface IRef {
  [key: string]: any;
}

interface IData {
  [key: string]: any;
}

interface IMethods {
  [key: string]: any;
}

interface IComputed {
  [key: string]: any;
}

interface IProps {
  [key: string]: any;
}

interface VInnerInterface extends VInterface {
  $data: IData;
  $refs: IRef;
}

export default (Vue as VueConstructor<VInnerInterface>).extend<IData, IMethods, IComputed, IProps>({

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

  data (): IData {
    return {
      tick: 0,
      usersItemsMessageError: ''
    }
  },

  computed: {
    ...mapGetters({
      usersProcessLoading: 'users/process_loading',
      usersTotal: 'users/total',
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
      this.$dialog.showAndWait(SUserDialogDelete, {
        onDelete: (data: unknown & { user_id: number; option: string }) => {
          // Процедура удаления пользователя
          // В полезной нагрузке мы передаём дополнительную информацию
          // receiver_user_id - идентификатор пользователя, которому будет передан контакт
          // Если не передать receiver_user_id то в качестве приёмщика, выступает удаляющий

          const payload: any = {}

          if (data.option === 'transfer_contacts_to_an_employee') {
            payload.receiver_user_id = data.user_id
          }

          new Users()
            .delete(item.id, payload)
            .then(() => {
              this.$toast.success('User deleted successfully')
              this.fetchUsers()
            }).catch((e) => {
              this.$toast.error(e.message)
            })
        },
        responsibleDisabled: true,
        text: this.$tc('The employee will be deleted, in order to save the contacts of this employee, you can transfer them to another owner.'),
        title: this.$tc('Removing an employee'),
        userDefaultId: this.$store.getters['profile/id'],
        width: '700px'
      })
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

<style lang="scss">
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

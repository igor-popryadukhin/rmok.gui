<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="9"
        lg="9"
      >
        <v-card
          flat
          tile
          outlined
        >
          <v-card-text>
            <v-toolbar
              class="v-toolbar-header"
              height="48"
              flat
            >
              <v-toolbar-title class="grey--text">
                {{ $tc('System users') }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :disabled="dataTableUsers.processLoading"
                icon
                @click="onButtonRefreshClick"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                :to="{ name: 'administrator_users_new_main' }"
                icon
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
            <v-data-table
              :headers="dataTableUsers.headers"
              :items="dataTableUsers.items"
              :server-items-length="dataTableUsers.totalCount"
              :page.sync="dataTableUsers.page"
              :items-per-page="dataTableUsers.itemsPerPage"
              :loading="dataTableUsers.processLoading"
              item-key="id"
              item-class="v-datatable-item"
              :loading-text="$tc('Loading content...')"
              :no-data-text="$tc('No data available')"
              disable-sort
              fixed-header
              calculate-widths
              hide-default-footer
              dense
              :height="dataTableUsersHeight"
              @pagination="onPaginationChange"
            >
              <template slot="header.email" slot-scope="{ header }">
                <span class="text-no-wrap">{{ header.text }}</span>
              </template>
              <template slot="item" slot-scope="{ item }">
                <tr class="v-datatable-item">
                  <td class="text-no-wrap">{{ item.first_name || $tc('—') }}</td>
                  <td class="text-no-wrap">{{ item.last_name || $tc('—') }}</td>
                  <td class="text-no-wrap">{{ item.middle_name || $tc('—') }}</td>
                  <td class="text-no-wrap">
                    {{ item.role ? item.role.name : '—' }}
                    <template v-if="item.role.id === 'r_operator'">
                      <v-icon
                        v-if="item.status === 'available'"
                        size="18"
                        color="green"
                      >
                        mdi-check-circle-outline
                      </v-icon>
                      <v-icon
                        v-if="item.status === 'do_not_disturb'"
                        size="18"
                        color="red"
                      >
                        mdi-do-not-disturb
                      </v-icon>
                      <v-icon
                        v-if="item.status === 'coffee_break'"
                        size="18"
                        color="blue"
                      >
                        mdi-pause-circle-outline
                      </v-icon>
                    </template>
                  </td>
                  <td class="text-no-wrap">{{ item.project ? item.project.name : '—' }}</td>
                  <td class="text-no-wrap">{{ item.group ? item.group.name : '—' }}</td>
                  <td class="text-no-wrap">{{ item.organization ? item.organization.name : '—'}}</td>
                  <td class="text-no-wrap text-right">
                    <v-btn
                      :to="{ name: 'administrator_users_edit_main', params: { user_id: item.id } }"
                      icon
                      small
                    >
                      <v-icon>mdi-pencil-box-outline</v-icon>
                    </v-btn>
                    <v-btn
                      color="red"
                      icon
                      small
                      @click="onDelete(item)"
                    >
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
          <v-footer color="white" class="d-flex justify-md-space-between pa-4 mt-auto" absolute>
            <v-pagination
              v-model="dataTableUsers.page"
              :length="dataTableUsers.pages"
              total-visible="6"
              :disabled="dataTableUsers.pages === 0"
            ></v-pagination>
            <div class="d-flex align-center justify-center">
              {{ this.dataTableUsers.pageStart }}-{{ this.dataTableUsers.pageStop }} из {{ this.dataTableUsers.totalCount }}
            </div>
          </v-footer>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        lg="3"
      >
        <v-card
          class="fill-height"
          style="min-height: 500px"
          flat
          tile
          outlined
        >
          <v-toolbar flat>
            <v-toolbar-title class="grey--text">{{ $tc('Filter') }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <s-organizations-autocomplete
              ref="sOrganizationsAutocomplete"
              v-model="filter.organization"
              :label="$tc('Organization')"
              clearable
              outlined
              dense
            />
          </v-card-text>
          <v-card-text>
            <s-projects-autocomplete
              ref="sProjectsAutocomplete"
              v-model="filter.project"
              :label="$tc('Project')"
              clearable
              outlined
              dense
            />
          </v-card-text>
          <v-card-text>
            <s-groups
              ref="sGroupsAutocomplete"
              v-model="filter.group"
              :label="$tc('Группа')"
              clearable
              outlined
              dense
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { UserInterface, Users } from '@/api/Users'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import { OrganizationInterface } from '@/api/Organizations'
import { ProjectInterface } from '@/api/Projects'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import { GroupInterface } from '@/api/Groups'
import VInterface from '@/VInterface'
import SUserDialogDelete from '@/snippets/SUserDialogDelete/SUserDialogDelete.vue'

interface IRef {
  [key: string]: any;
}

interface IData {
  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $data: IData;
  $refs: IRef;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: {
    SGroups,
    SProjectsAutocomplete,
    SOrganizationsAutocomplete
  },

  data (): IData {
    return {
      filter: {
        organization: null,
        project: null,
        group: null
      },
      dataTableUsers: {
        processLoading: false,
        page: 1,
        pages: 0,
        totalCount: 0,
        itemsPerPage: 20,
        pageStart: 0,
        pageStop: 0,
        headers: [
          { text: 'Имя', align: 'start', sortable: true, value: 'first_name', width: 'auto' },
          { text: 'Фамилия', align: 'start', sortable: true, value: 'last_name' },
          { text: 'Отчество', align: 'start', sortable: true, value: 'middle_name' },
          { text: 'Роль', align: 'start', sortable: true, value: 'role' },
          { text: 'Проект', align: 'start', sortable: true, value: 'project' },
          { text: 'Группа', align: 'start', sortable: true, value: 'group' },
          { text: 'Организация', align: 'start', sortable: true, value: 'organization' },
          { text: '', align: 'end', sortable: true, value: 'actions', width: '100%' }
        ],
        items: [] as UserInterface[]
      }
    }
  },

  watch: {
    'dataTableUsers.page': {
      handler () {
        this.fetchUsers()
      }
    }
  },

  computed: {
    // Вычисляю высоту таблицы
    dataTableUsersHeight () {
      let h: number = this.$screenHeight - 170
      if (h < 640) { h = 640 }
      return h
    }
  },

  mounted () {
    // this.$refs.sOrganizationsAutocomplete.fetchData()

    const promises: Promise<any>[] = []
    // Установка фильтров
    if (this.assertObjectHasAttribute(this.$route.query, 'organization_id')) {
      promises.push(this.$refs.sOrganizationsAutocomplete.setDefault(this.$route.query.organization_id))
    }
    if (this.assertObjectHasAttribute(this.$route.query, 'project_id')) {
      promises.push(this.$refs.sProjectsAutocomplete.setDefault(this.$route.query.project_id))
    }
    if (this.assertObjectHasAttribute(this.$route.query, 'group_id')) {
      promises.push(this.$refs.sGroupsAutocomplete.setDefault(this.$route.query.group_id))
    }

    // Нужно подождать, пока будут установлены все фильтры.
    Promise.all(promises)
      .finally(() => {
        this.fetchUsers()

        // Слежу за изменениями фильтра "Организации"
        this.$watch('filter.organization', (org: OrganizationInterface) => {
          if (org) {
            this.$routerQuery.setQuery({
              organization_id: org.id
            }).then(this.fetchUsers)
          } else {
            this.$routerQuery.removeQuery([
              'organization_id'
            ]).then(this.fetchUsers)
          }
        })

        // Слежу за изменениями фильтра "Проекты"
        this.$watch('filter.project', (project: ProjectInterface) => {
          if (project) {
            this.$routerQuery.setQuery({
              project_id: project.id
            }).then(this.fetchUsers)
          } else {
            this.$routerQuery.removeQuery([
              'project_id'
            ]).then(this.fetchUsers)
          }
        })

        // Слежу за изменениями фильтра "Группы"
        this.$watch('filter.group', (group: GroupInterface) => {
          if (group) {
            this.$routerQuery.setQuery({
              group_id: group.id
            }).then(this.fetchUsers)
          } else {
            this.$routerQuery.removeQuery([
              'group_id'
            ]).then(this.fetchUsers)
          }
        })
      })
  },

  methods: {
    fetchUsers () {
      this.dataTableUsers.processLoading = true
      const offset = (this.dataTableUsers.itemsPerPage * this.dataTableUsers.page) - this.dataTableUsers.itemsPerPage

      const params: any = {
        offset,
        count: this.dataTableUsers.itemsPerPage
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'organization_id')) {
        params.organization_id = this.$route.query.organization_id
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'project_id')) {
        params.project_id = this.$route.query.project_id
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'group_id')) {
        params.group_id = this.$route.query.group_id
      }

      new Users()
        .find<{count: number}, UserInterface[]>(params)
        .then((response) => {
          const count: number = response.meta.count || 0

          this.dataTableUsers.totalCount = count
          this.dataTableUsers.pages = Math.ceil(count / this.dataTableUsers.itemsPerPage)
          this.dataTableUsers.items = response.data
        }).finally(() => (this.dataTableUsers.processLoading = false))
    },

    onButtonRefreshClick () {
      this.fetchUsers()
    },

    onPaginationChange (data: any) {
      this.dataTableUsers.pageStart = data.pageStart + 1
      this.dataTableUsers.pageStop = data.pageStop
    },

    /**
     * Срабатывает когда в списке "пользователи системы" нажали кнопу удалить пользователя
     * @param item Элемент массива UserInterface[]
     */
    onDelete (item: UserInterface) {
      this.$dialog.showAndWait(SUserDialogDelete, {
        title: this.$tc('Removing an employee'),
        text: this.$tc('The employee will be deleted, in order to save the contacts of this employee, you can transfer them to another owner.'),
        userDefaultId: this.$store.getters['profile/id'],
        responsibleDisabled: true,
        width: '700px',
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
        }
      })
    }
  }
})
</script>

<style>

.v-toolbar-header div {
  padding: 0 !important;
}

.v-toolbar-header div:last-child {
  margin-right: 10px;
}
</style>

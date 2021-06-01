<template>
  <v-card
    flat
    tile
  >
    <v-row>
      <v-col
        cols="12"
        md="9"
        lg="9"
      >
        <v-data-table
          :headers="dataTableUsers.headers"
          :items="dataTableUsers.items"
          :server-items-length="dataTableUsers.totalCount"
          :page.sync="dataTableUsers.page"
          :items-per-page="dataTableUsers.itemsPerPage"
          :loading="dataTableUsers.processLoading"
          :loading-text="$tc('Loading content...')"
          :no-data-text="$tc('No data available')"
          :height="dataTableUsersHeight"
          :item-class="vDataTableItemClass"
          :sort-by.sync="dataTableUsers.sortBy"
          :sort-desc.sync="dataTableUsers.sortDesc"
          item-key="id"
          multi-sort
          fixed-header
          calculate-widths
          hide-default-footer
          dense
          @pagination="onPaginationChange"
        >
          <template v-slot:top>
            <v-toolbar
              class="v-toolbar-header mb-2"
              height="48"
              flat
            >
              <template v-if="dataTableUsers.selected.length === 0">
                <v-btn
                  class="float-right"
                  :disabled="dataTableUsers.processLoading"
                  small
                  tile
                  text
                  @click="onButtonRefreshClick"
                >
                  Обновить
                </v-btn>
              </template>
              <v-btn
                color="ml-5 float-right"
                :disabled="!$permission.isGranted('role.create')"
                small
                tile
                text
                @click="onAddClick"
              >
                {{ $tc('Add') }}
              </v-btn>
              <v-spacer/>
              <!-- Paginator -->
              <app-pagination
                v-model="dataTableUsers.page"
                :length="dataTableUsers.pages"
                :disabled="dataTableUsers.processLoading || dataTableUsers.selectedWhole"
              >
                <template v-slot:display>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        tile
                        text
                        small
                      >
                        {{ dataTableUsers.pageStart }}-{{ dataTableUsers.pageStop }} из {{ dataTableUsers.totalCount }}
                      </v-btn>
                    </template>
                    <v-list
                      class="py-0"
                      dense
                      flat
                    >
                      <v-list-item
                        link
                      >
                        <v-list-item-content>
                          <v-list-item-title>Самые новые</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        link
                      >
                        <v-list-item-content>
                          <v-list-item-title>Самые старые</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </app-pagination>
              <!-- Paginator -->

            </v-toolbar>
            <!-- Банеры -->

          </template>

          <template slot="item.name" slot-scope="{ item }">
            {{ item.last_name }} {{ item.first_name }} {{ item.middle_name }}
          </template>

          <template slot="item.role" slot-scope="{ item }">
            <template v-if="item.role">
              {{ item.role.name }}
            </template>
          </template>

          <template slot="item.project" slot-scope="{ item }">
            <template v-if="item.project">
              {{ item.project.name }}
            </template>
          </template>

          <template slot="item.group" slot-scope="{ item }">
            <template v-if="item.group">
              {{ item.group.name }}
            </template>
          </template>

          <template slot="item.actions" slot-scope="{ item }">
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
          </template>

          <!--          <template slot="item" slot-scope="{ item }">-->
          <!--            <tr class="v-datatable-item">-->
          <!--              <td class="text-no-wrap">-->
          <!--                {{ item.first_name }} {{ item.last_name }} {{ item.middle_name }}-->
          <!--              </td>-->
          <!--              <td class="text-no-wrap">-->
          <!--                {{ item.role ? item.role.name : '—' }}-->
          <!--              </td>-->
          <!--              <td class="text-no-wrap">{{ item.project ? item.project.name : '—' }}</td>-->
          <!--              <td v-if="$permission.isGranted('user.view_outside_your_group')" class="text-no-wrap">{{ item.group ? item.group.name : '—' }}</td>-->
          <!--              <td v-if="$permission.isSuperAdmin" class="text-no-wrap">{{ item.organization ? item.organization.name : '—' }}</td>-->
          <!--              <td class="text-no-wrap text-right">-->
          <!--                <v-btn-->
          <!--                  :to="{ name: 'administrator_users_edit_main', params: { user_id: item.id } }"-->
          <!--                  icon-->
          <!--                  small-->
          <!--                >-->
          <!--                  <v-icon>mdi-pencil-box-outline</v-icon>-->
          <!--                </v-btn>-->
          <!--                <v-btn-->
          <!--                  color="red"-->
          <!--                  icon-->
          <!--                  small-->
          <!--                  @click="onDelete(item)"-->
          <!--                >-->
          <!--                  <v-icon>mdi-delete-outline</v-icon>-->
          <!--                </v-btn>-->
          <!--              </td>-->
          <!--            </tr>-->
          <!--          </template>-->
        </v-data-table>
      </v-col>

      <v-col
        class="pl-md-0 pl-lg-0 pl-xl-0"
        cols="12"
        md="3"
        lg="3"
      >
        <v-card
          class="fill-height"
          style="min-height: 500px"
          flat
          tile
        >
          <v-toolbar flat>
            <v-toolbar-title class="grey--text">{{ $tc('Filter') }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text class="py-0">
            <app-search-input
              v-model="filter.q"
              :label="$tc('Search')"
            />
          </v-card-text>
          <v-card-text v-if="$permission.isSuperAdmin" class="py-1">
            <s-organizations-autocomplete
              ref="sOrganizationsAutocomplete"
              v-model="filter.organization"
              :label="$tc('Organization')"
              clearable
              outlined
              dense
            />
          </v-card-text>
          <v-card-text class="py-1">
            <s-projects-autocomplete
              ref="sProjectsAutocomplete"
              v-model="filter.project"
              :label="$tc('Project')"
              clearable
              outlined
              dense
            />
          </v-card-text>
          <v-card-text v-if="$permission.isGranted('user.view_outside_your_group')" class="py-1">
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
  </v-card>
</template>

<script lang="ts">
import { GroupInterface } from '@/api/Groups'
import { OrganizationInterface } from '@/api/Organizations'
import { ProjectInterface } from '@/api/Projects'
import { UserInterface, Users } from '@/api/Users'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import AppSearchInput from '@/components/AppSearchInput/AppSearchInput.vue'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import SUserDialogDelete from '@/snippets/SUserDialogDelete/SUserDialogDelete.vue'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import { debounce } from 'vuetify/src/util/helpers'

  interface IRef {
    [key: string]: any;
  }

  interface IData {
    [key: string]: any;
    /** Метод для загрузки списка пользователей */
    fetchUsers: () => void;
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
  components: {
    AppPagination,
    AppSearchInput,
    SGroups,
    SOrganizationsAutocomplete,
    SProjectsAutocomplete
  },

  computed: {
    // Вычисляю высоту таблицы
    dataTableUsersHeight () {
      let h: number = this.$screenHeight - 150
      if (h < 640) { h = 640 }
      return h
    }
  },

  created () {
    // Опционально только для супер администраторов
    if (this.$permission.isGranted('user.view_outside_your_group')) {
      this.dataTableUsers.headers.push({
        align: 'start',
        divider: true,
        sortable: true,
        text: 'Группа',
        value: 'group',
        width: 'auto'
      })
    }

    // Всегда добавляем в конец
    this.dataTableUsers.headers.push({
      align: 'end',
      divider: true,
      sortable: false,
      text: '',
      value: 'actions',
      width: 'auto'
    })
  },

  data (): IData {
    return {
      dataTableUsers: {
        headers: [
          {
            align: 'start',
            divider: true,
            sortable: true,
            text: 'Пользователь',
            value: 'name',
            width: '100%'
          },
          {
            align: 'start',
            divider: true,
            sortable: true,
            text: 'Роль',
            value: 'role',
            width: 'auto'
          },
          {
            align: 'start',
            divider: true,
            sortable: true,
            text: 'Текущий проект',
            value: 'project',
            width: 'auto'
          }
        ],
        items: [] as UserInterface[],
        itemsPerPage: 50,
        page: 1,
        pageStart: 0,
        pageStop: 0,
        pages: 0,
        processLoading: false,
        selected: [],
        selectedWhole: false,
        sortBy: [],
        sortDesc: [],
        totalCount: 0
      },
      fetchUsers: debounce(() => {
        this.dataTableUsers.processLoading = true
        const offset = (this.dataTableUsers.itemsPerPage * this.dataTableUsers.page) - this.dataTableUsers.itemsPerPage

        const params: any = {
          count: this.dataTableUsers.itemsPerPage,
          offset
        }

        if (this.assertObjectHasAttribute(this.$route.query, 'q')) {
          params.q = this.$route.query.q.trim()
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

        // Дополнительные реквизиты
        params.props = []
        if (this.$permission.isSuperAdmin) {
          params.props.push('organization')
        }

        if (this.$permission.isGranted('user.view_outside_your_group')) {
          params.props.push('group')
        }

        params.props.push('project')

        // Параметры сортировки
        this.dataTableUsers.sortBy.forEach((sortBy: string, index: number) => {
          params[`order_by[${sortBy}]`] = this.dataTableUsers.sortDesc[index] ? 'desc' : 'asc'
        })

        new Users()
          .find<{count: number}, UserInterface[]>(params)
          .then((response) => {
            const count: number = response.meta.count || 0

            this.dataTableUsers.totalCount = count
            this.dataTableUsers.pages = Math.ceil(count / this.dataTableUsers.itemsPerPage)
            this.dataTableUsers.items = response.data
          }).finally(() => (this.dataTableUsers.processLoading = false))
      }, 250),

      filter: {
        group: null,
        organization: null,
        project: null,
        q: ''
      }
    }
  },

  methods: {

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

    onPaginationChange (data: any) {
      this.dataTableUsers.pageStart = data.pageStart + 1
      this.dataTableUsers.pageStop = data.pageStop
    },

    /**
       * Происходит когда пользователь вводит текст в поле поиска.
       **/
    onUserSearch (text: string) {
      console.log(text)
    },

    vDataTableItemClass (scope: any) {
      return 'v-dt-item'
    },
    onAddClick () {
      this.$router.push({ name: 'administrator_users_new_main' })
    }
  },

  mounted () {
    // this.$refs.sOrganizationsAutocomplete.fetchData()

    const promises: Promise<any>[] = []
    // Установка фильтров
    if (this.assertObjectHasAttribute(this.$route.query, 'q')) {
      this.$data.filter.q = this.$route.query.q
    }

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

        // Слежу за строкой поиска
        this.$watch('filter.q', (s: string) => {
          if (s) {
            this.$routerQuery.setQuery({
              q: s
            }).then(this.fetchUsers)
          } else {
            this.$routerQuery.removeQuery([
              'q'
            ]).then(this.fetchUsers)
          }
        })

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

        // АТОМАРНОЕ ОБНОВЛЕНИЕ СОРТИРОВКИ

        /**
           * Функция, реагирующая на изменение свойств sortDesc, sortDesc объекта dataTableUsers
           */
        const dataTableSortUpdate = debounce(() => {
          const sort = []
          for (let i = 0; i < Math.min(this.dataTableUsers.sortBy.length, this.dataTableUsers.sortDesc.length); i++) {
            const sortDesc: string = this.dataTableUsers.sortDesc[i]
            const sortBy: boolean = this.dataTableUsers.sortBy[i]

            sort.push({ sort_by: sortBy, sort_desc: sortDesc })
          }

          if (sort.length > 0) {
            // Преобразовываю в JSON и сохраняю в строку браузера
            this.$routerQuery.setQuery({
              sort: JSON.stringify(sort)
            }).then(() => {
              this.fetchUsers()
            })
          } else {
            this.$routerQuery
              .removeQuery(['sort'])
              .then(() => {
                this.fetchUsers()
              })
          }
        }, 100)

        // Слежу за изменениями параметров сортировки
        this.$watch('dataTableUsers.sortBy', dataTableSortUpdate)
        this.$watch('dataTableUsers.sortDesc', dataTableSortUpdate)
      })
  },

  watch: {
    'dataTableUsers.page': {
      handler () {
        this.fetchUsers()
      }
    }
  }
})
</script>

<style lang="scss">
  .v-dt-item {
    & > td {
      white-space:nowrap;
    }
  }

  .v-toolbar-header div {
    padding: 0 !important;
  }

  .v-toolbar-header div:last-child {
    margin-right: 10px;
  }
</style>

<template>
  <v-row>
    <v-col
      class="py-0"
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
            class="v-toolbar-header mb-2"
            height="48"
            flat
          >
            <v-toolbar-title class="grey--text">
              {{ $tc('Contacts') }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn-toggle tile borderless group>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :disabled="dataTableContacts.selected.length === 0"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-export</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    link
                    @click="onTransferContactsToProjectClick"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ $tc('Transfer contacts to another project') }}</v-list-item-title>
                      <v-list-item-subtitle>{{ $tc('История и задачи не сохраняются.') }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    :disabled="!assertObjectHasAttribute(filter.project, 'id')"
                    link
                    @click="onTransferContactToOperatorWithinProjectClick"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ $tc('Передать контакты оператору внутри проекта') }}</v-list-item-title>
                      <v-list-item-subtitle>{{ $tc('Также передаются: задачи, история.') }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn
                :disabled="dataTableContacts.processLoading"
                @click="onButtonRefreshClick"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                :to="{ name: 'administrator_contacts_new' }"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-toolbar>
          <v-data-table
            id="v-data-table"
            :headers="dataTableContacts.headers"
            :items="dataTableContacts.items"
            :server-items-length="dataTableContacts.totalCount"
            :page.sync="dataTableContacts.page"
            :items-per-page="dataTableContacts.itemsPerPage"
            item-key="id"
            item-class="v-datatable-item"
            :loading-text="$tc('Loading content...')"
            :no-data-text="$tc('No data available')"
            :height="$screenHeight - 100"
            disable-sort
            fixed-header
            calculate-widths
            hide-default-footer
            dense
            @pagination="onPaginationChange"
          >
            <template
              slot="header.checkbox"
            >
              <v-checkbox
                v-model="dataTableContacts.selectedAll"
                :indeterminate="dataTableContacts.selected.length < dataTableContacts.items.length && dataTableContacts.selected.length > 0"
                :ripple="false"
                class="ma-0 pa-0"
                hide-details
                dense
              />
            </template>

            <template slot="item" slot-scope="{ item }">
              <tr class="v-datatable-item">
                <td class="text-no-wrap">
                  <template v-if="dataTableContacts.processLoading">
                    <v-skeleton-loader class="mb-0" height="15" width="15" tile type="text" />
                  </template>
                  <template v-else>
                    <v-checkbox
                      v-model="dataTableContacts.selected"
                      :ripple="false"
                      class="ma-0 pa-0"
                      :value="item.id"
                      hide-details
                      dense
                    />
                  </template>
                </td>
                <td class="text-no-wrap">
                  <template v-if="dataTableContacts.processLoading">
                    <v-skeleton-loader class="mb-0" height="15" tile type="text" />
                  </template>
                  <template v-else>
                    {{ item.first_name || '' }} {{ item.last_name || '' }} {{ item.middle_name || '' }}
                  </template>
                </td>
                <td class="text-no-wrap">
                  <template v-if="dataTableContacts.processLoading">
                    <v-skeleton-loader class="mb-0" height="15" tile type="text" />
                  </template>
                  <template v-else>
                    {{ item.responsible ? `${item.responsible.first_name} ${item.responsible.last_name}` : '—' }}
                  </template>
                </td>
                <td class="text-no-wrap">
                  <template v-if="dataTableContacts.processLoading">
                    <v-skeleton-loader class="mb-0" height="15" tile type="text" />
                  </template>
                  <template v-else>
                    {{ item.project ? item.project.name : '—' }}
                  </template>
                </td>
                <td class="text-no-wrap">
                  <template v-if="dataTableContacts.processLoading">
                    <v-skeleton-loader class="mb-0" height="15" width="210" type="text" tile />
                  </template>
                  <template v-else>
                    <span v-if="item.last_call_at">
                      {{ $moment.unix(item.last_call_at).format('Do MMMM YYYY, в h:mm:ss a')  }}
                    </span>
                    <span v-else>
                      —
                    </span>
                  </template>
                </td>
                <td class="text-no-wrap">
                  <template v-if="dataTableContacts.processLoading">
                    <v-skeleton-loader class="mb-0" height="15" tile type="text" />
                  </template>
                  <template v-else>
                    <v-btn
                      icon
                      small
                      :to="{ name: 'administrator_contacts_history', params: { contact_id: item.id } }"
                    >
                      <v-icon>mdi-history</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      small
                      :to="{ name: 'administrator_contacts_edit', params: { contact_id: item.id } }"
                    >
                      <v-icon>mdi-pencil-box-outline</v-icon>
                    </v-btn>
                  </template>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-footer class="d-flex justify-md-space-between pa-4 mt-auto" color="white">
          <v-pagination
            v-model="dataTableContacts.page"
            :length="dataTableContacts.pages"
            total-visible="5"
            :disabled="dataTableContacts.pages === 0"
          ></v-pagination>
          <div class="d-flex align-center justify-center">
            {{ this.dataTableContacts.pageStart }}-{{ this.dataTableContacts.pageStop }} из {{ this.dataTableContacts.totalCount }}
          </div>
        </v-footer>
      </v-card>
    </v-col>
    <v-col
      class="py-0 pl-md-0 pl-lg-0 pl-xl-0"
      cols="12"
      md="3"
      lg="3"
    >
      <v-card
        class="fill-height"
        flat
        tile
        outlined
      >
        <v-toolbar flat>
          <v-toolbar-title class="grey--text">{{ $tc('Filter') }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text class="pt-0">
          <s-projects-autocomplete
            ref="sProjectsAutocomplete"
            v-model="filter.project"
            :label="$tc('Project')"
            clearable
            outlined
            dense
          />
        </v-card-text>
        <v-card-text class="pt-0">
          <s-users
            ref="sUsersAutocomplete"
            v-model="filter.responsible"
            :label="$tc('Responsible')"
            :params="{ role_use: 'for_calls' }"
            clearable
            outlined
            dense
          />
        </v-card-text>
        <v-card-text class="pt-0">
          <v-select
            v-model="filter.task.selected"
            :items="filter.task.options"
            :label="$tc('Tasks')"
            item-text="title"
            item-value="value"
            clearable
            outlined
            dense
          >
            <template v-slot:selection="{ item }">
              {{ $tc(item.title) }}
            </template>
            <template v-slot:item="{ item }">
              {{ $tc(item.title) }}
            </template>
          </v-select>
        </v-card-text>
        <v-card-text class="pt-0">
          <v-select
            v-model="filter.last_call_at.selected"
            :items="filter.last_call_at.options"
            :label="$tc('Прозвонено')"
            clearable
            outlined
            dense
          >
            <template v-slot:selection="{ item }">
              {{ $tc(item) }}
            </template>
            <template v-slot:item="{ item }">
              {{ $tc(item) }}
            </template>
          </v-select>
        </v-card-text>
        <v-card-text class="pt-0">
          <h4>{{ $tc('Дата создания контакта') }}</h4>
          <v-date-picker
            v-model="filter.contact_create_date"
            :first-day-of-week="1"
            locale="ru"
            flat
            no-title
            scrollable
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="filter.contact_create_date = ''"
            >
              {{ $tc('Clear') }}
            </v-btn>
          </v-date-picker>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { ProjectInterface } from '@/api/Projects'
import { Contacts } from '@/api/Contacts'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import { UserInterface } from '@/api/Users'
import SContactExportDialog, { SContactExportScopeInterface } from '@/snippets/SContactExportDialog/SContactExportDialog.vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import { debounce } from 'vuetify/src/util/helpers'

interface IRefs {
  sProjectsAutocomplete: any
  sUsersAutocomplete: any
  [key: string]: any;
}

interface IData {
  [key: string]: any;
}

interface VInnerInterface extends VInterface {
  $refs: IRefs
  $data: IData
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: {
    SUsers,
    SProjectsAutocomplete
  },

  data (): IData {
    return {
      filter: {

        // Фильтрация по проектам
        project: null,

        // Фильтрация по владельцу/ответственному
        responsible: null,

        // Фильтрация по дате создания контакта
        contact_create_date: null,

        // Фильтрация по задачам
        task: {
          selected: null,
          options: [
            {
              title: 'There are tasks',
              value: 'available'
            },
            {
              title: 'No tasks',
              value: 'unavailable'
            },
            {
              title: 'Overdue tasks',
              value: 'overdue'
            },
            {
              title: 'Not overdue tasks',
              value: 'not_overdue'
            }
          ]
        },

        // Фильтрация по наличию последнего звонка
        last_call_at: {
          selected: null,
          options: ['yes', 'no']
        }
      },
      dataTableContacts: {
        processLoading: false,
        page: 1,
        pages: 0,
        totalCount: 0,
        itemsPerPage: 25,
        pageStart: 0,
        pageStop: 0,
        headers: [
          { text: ' ', align: 'start', sortable: true, value: 'checkbox' },
          { text: this.$tc('Client'), align: 'start', sortable: true, value: 'client', width: 'auto' },
          { text: this.$tc('Responsible'), align: 'start', sortable: true, value: 'responsible', width: 'auto' },
          { text: this.$tc('Project'), align: 'start', sortable: true, value: 'project', width: 'auto' },
          { text: this.$tc('Date and time of the last call'), align: 'start', sortable: true, value: 'last_call_at', width: '133px' },
          { text: '', align: 'end', sortable: false, value: 'actions', width: '88px' }
        ],
        selectedAll: false,
        selected: [],
        items: [] as unknown & ContactInterface[]
      }
    }
  },

  watch: {
    'dataTableContacts.page': {
      handler () {
        this.fetchContacts()
      }
    },

    // Слежу за CheckBox который выделяет все элементы списка
    'dataTableContacts.selectedAll': {
      handler (val: boolean) {
        if (val) {
          this.dataTableContacts.selected = this.dataTableContacts.items.map((e: unknown & ContactInterface) => e.id)
        } else {
          this.dataTableContacts.selected = []
        }
      }
    },

    // Идентификаторы выделенных контактов
    'dataTableContacts.selected': {
      handler (selected: unknown & number[]) {
        if (selected.length === this.dataTableContacts.items.length) {
          this.dataTableContacts.selectedAll = true
        } else if (selected.length === 0) {
          this.dataTableContacts.selectedAll = false
        }
      }
    }
  },

  computed: {
    // Вычисляю высоту таблицы
    dataTableContactsHeight () {
      let h: number = this.$screenHeight - 260
      if (h < 640) { h = 640 }
      return h
    }
  },

  mounted () {
    // this.onTransferContactsToProjectClick()
    const promises = []

    if (this.$refs.sProjectsAutocomplete) {
      this.$refs.sProjectsAutocomplete.fetchData()
    }

    if (this.$refs.sUsersAutocomplete) {
      this.$refs.sUsersAutocomplete.fetchData()
    }

    // Установка фильтров
    if (this.$routerQuery.hasQuery('project_id')) {
      promises.push(this.$refs.sProjectsAutocomplete.setDefault(this.$routerQuery.getQuery('project_id')))
    }

    if (this.$routerQuery.hasQuery('responsible_id')) {
      promises.push(this.$refs.sUsersAutocomplete.setDefault(this.$routerQuery.getQuery('responsible_id')))
    }

    if (this.$routerQuery.hasQuery('last_call_at')) {
      switch (this.$routerQuery.getQuery('last_call_at')) {
        case '0': {
          this.filter.last_call_at.selected = 'no'
          break
        }
        case '1': {
          this.filter.last_call_at.selected = 'yes'
          break
        }
      }
    }

    if (this.$routerQuery.hasQuery('contact_create_date')) {
      this.filter.contact_create_date = this.$moment.unix(+this.$route.query.contact_create_date).format('YYYY-MM-DD')
    }

    // Инициализирую слежку за состоянием фильтров после того как будут проинициализированы все фильтры
    // Загружаем данные контактов после инициализации фильтров
    Promise.all(promises)
      .finally(() => {
        this.fetchContacts()
        this.initializeWatchForFilters()
      })
  },

  methods: {
    fetchContacts () {
      this.dataTableContacts.processLoading = true
      const offset = (this.dataTableContacts.itemsPerPage * this.dataTableContacts.page) - this.dataTableContacts.itemsPerPage

      const params: any = {
        fields: 'responsible,organization,project',
        offset,
        count: this.dataTableContacts.itemsPerPage
      }

      if (this.$routerQuery.hasQuery('project_id')) {
        params.project_id = this.$routerQuery.getQuery<number>('project_id')
      }

      if (this.$routerQuery.hasQuery('responsible_id')) {
        params.responsible_id = this.$routerQuery.getQuery<number>('responsible_id')
      }

      if (this.$routerQuery.hasQuery('last_call_at')) {
        params.last_call_at = this.$routerQuery.getQuery('last_call_at')
      }

      if (this.$routerQuery.hasQuery('contact_create_date')) {
        params.contact_create_date = this.$routerQuery.getQuery('contact_create_date')
      }

      if (this.$routerQuery.hasQuery('task')) {
        params.task = this.$routerQuery.getQuery('task')
      }

      new Contacts()
        .find<{count: number}, ContactInterface[]>(params)
        .then((response) => {
          this.dataTableContacts.totalCount = response.meta.count
          this.dataTableContacts.pages = Math.ceil(response.meta.count / this.dataTableContacts.itemsPerPage)
          this.dataTableContacts.items = response.data
        }).finally(() => (this.dataTableContacts.processLoading = false))
    },

    onButtonRefreshClick () {
      this.fetchContacts()
    },

    /**
     * Передать контакты в другой проект
     */
    async onTransferContactsToProjectClick () {
      const instance = await this.$dialog.show(SContactExportDialog, {
        waitForResult: false,
        subtitle: this.$tc('No contacts selected | {n} contact selected | {n} contact selected | {n} contacts selected', this.dataTableContacts.selected.length),
        persistent: true,
        // scope - набор опций для передачи контактов
        onTransfer: (scope: SContactExportScopeInterface) => {
          const data: unknown & SContactExportScopeInterface & { target_contacts: number[] } = {
            target_project: scope.target_project,
            target_users: scope.target_users,
            target_contacts: this.dataTableContacts.selected
          }

          // Опционально меняем дату, в scope.new_date timestamp
          if (this.assertObjectHasAttribute(scope, 'new_date')) {
            data.new_date = scope.new_date
          }

          new Contacts()
            .transfer(data)
            .then(() => {
              this.$toast.success(this.$tc('Transfer success'))
            }).catch((error) => {
              if (error instanceof APIError) {
                error.errors.forEach((value) => {
                  this.$toast.error(this.$tc(value.message))
                })
                this.$toast.error(this.$tc(error.error_message))
              }
            }).finally(() => {
              this.dataTableContacts.selected = [] // Отменить выделение всех контактов
              this.fetchContacts() // Обновить список контактов
              instance.close() // Закрыть диалог
            })
        },

        onCancel: () => {
          instance.close()
        }
      })
    },

    /**
     * Передать контакты оператору в рамках текущего проекта
     */
    async onTransferContactToOperatorWithinProjectClick () {
      const instance = await this.$dialog.show(SContactExportDialog, {
        waitForResult: false,
        subtitle: this.$tc('No contacts selected | {n} contact selected | {n} contact selected | {n} contacts selected', this.dataTableContacts.selected.length),
        persistent: true,
        project_id: this.filter.project.id,
        // scope - набор опций для передачи контактов
        onTransfer: (scope: SContactExportScopeInterface) => {
          const data: unknown & SContactExportScopeInterface & { target_contacts: number[] } = {
            target_users: scope.target_users,
            target_contacts: this.dataTableContacts.selected
          }

          // Опционально меняем дату, в scope.new_date timestamp
          if (this.assertObjectHasAttribute(scope, 'new_date')) {
            data.new_date = scope.new_date
          }

          new Contacts()
            .transfer(data)
            .then(() => {
              this.$toast.success(this.$tc('Transfer success'))
            }).catch((error) => {
              if (error instanceof APIError) {
                error.errors.forEach((value) => {
                  this.$toast.error(this.$tc(value.message))
                })
                this.$toast.error(this.$tc(error.error_message))
              }
            }).finally(() => {
              this.dataTableContacts.selected = [] // Отменить выделение всех контактов
              this.fetchContacts() // Обновить список контактов
              instance.close() // Закрыть диалог
            })
        },

        onCancel: () => {
          instance.close()
        }
      })
    },

    onPaginationChange (data: any) {
      this.dataTableContacts.pageStart = data.pageStart + 1
      this.dataTableContacts.pageStop = data.pageStop
    },

    /**
     * Инициализировать слежку за изменением фильтров
     */
    initializeWatchForFilters () {
      const debounceDelay = 500 // Задержка, избавит от дребезга

      // Фильтрация по проектам
      this.$watch('filter.project', debounce((newVal: unknown & ProjectInterface) => {
        if (this.assertObjectHasAttribute(newVal, 'id')) {
          this.$routerQuery.setQuery({
            project_id: newVal.id
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'project_id'
          ]).then(this.fetchContacts)
        }
      }, debounceDelay))

      // Фильтрация по ответственным
      this.$watch('filter.responsible', debounce((newVal: unknown & UserInterface) => {
        if (newVal) {
          this.$routerQuery.setQuery({
            responsible_id: newVal.id
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'responsible_id'
          ]).then(this.fetchContacts)
        }
      }, debounceDelay))

      // Фильтр Задачи
      this.$watch('filter.task.selected', debounce((newVal: unknown & string) => {
        if (newVal) {
          this.$routerQuery.setQuery({
            task: newVal
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'task'
          ]).then(this.fetchContacts)
        }
      }, debounceDelay))

      // Фильтр прозвона
      this.$watch('filter.last_call_at.selected', debounce((newVal: unknown & string) => {
        if (newVal) {
          // TODO: В будущем могут быть и другие значения.
          let last_call_at = '0'

          switch (newVal) {
            case 'yes': {
              last_call_at = '1' // Показать все контакты которым звонили
              break
            }
            case 'no': {
              last_call_at = '0' // Показать все контакты которым не звонили
              break
            }
          }

          this.$routerQuery.setQuery({
            last_call_at
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'last_call_at'
          ]).then(this.fetchContacts)
        }
      }, debounceDelay))

      // Фильтрация по дате создания контакта
      this.$watch('filter.contact_create_date', debounce((newVal: unknown) => {
        if (typeof newVal === 'string') {
          this.$routerQuery.setQuery({
            contact_create_date: this.$moment(newVal).unix()
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'contact_create_date'
          ]).then(this.fetchContacts)
        }
      }, debounceDelay))
    }
  }
})
</script>

<style lang="scss">

.v-toolbar-header div {
  padding: 0 !important;
}

#v-data-table table thead th {
  white-space: nowrap !important;

  &:nth-child(1) {
    max-width: 5px !important;
  }

}

#v-data-table table tbody tr {
  & td:nth-child(1) {
    max-width: 1px !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & td:nth-child(2) {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & td:nth-child(3) {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

}

.v-toolbar-header div:last-child {
  margin-right: 10px;
}
</style>

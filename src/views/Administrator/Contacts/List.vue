<template>
  <v-card
    :height="vCardHeightComputed"
    flat
    tile
  >
    <v-row>
      <!-- Основная таблица -->
      <v-col
        cols="9"
      >
        <v-data-table
          :headers="dataTableContacts.headers"
          :items="dataTableContacts.items"
          :server-items-length="dataTableContacts.totalCount"
          :page.sync="dataTableContacts.page"
          :items-per-page="dataTableContacts.itemsPerPage"
          :loading-text="$tc('Loading content...')"
          :no-data-text="$tc('No data available')"
          :height="vDataTableHeightComputed"
          id="v-data-table"
          item-key="id"
          item-class="v-datatable-item"
          disable-sort
          fixed-header
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
              <v-checkbox
                v-model="dataTableContacts.selectedAll"
                :indeterminate="dataTableContacts.selectedIndeterminate"
                :disabled="dataTableContacts.selectedWhole"
                class="ml-4 mr-0"
                hide-details
                dense
              />
              <template v-if="dataTableContacts.selected.length === 0">
                <v-btn
                  :disabled="dataTableContacts.processLoading"
                  small
                  tile
                  text
                  @click="onButtonRefreshClick"
                >
                  Обновить
                </v-btn>
              </template>

              <!-- Импорт -->
              <template v-if="dataTableContacts.selected.length === 0">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      text
                      tile
                      small
                    >
                      {{ $tc('Import') }}
                    </v-btn>
                  </template>
                  <v-list
                    class="py-0"
                    dense
                  >
                    <v-list-item
                      link
                      disabled
                      @click="onImportClick('csv')"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ $tc('Import from CSV') }}</v-list-item-title>
                        <v-list-item-subtitle>{{ $tc('Text format') }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      link
                      @click="onImportClick('excel')"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ $tc('Import from Excel') }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ $tc('Office Open XML (.xlsx, .xls) Excel 2007, Excel 97 and above') }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <!-- Импорт -->

              <!-- Передача контактов -->
              <template v-if="dataTableContacts.selected.length > 0">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      text
                      tile
                      small
                    >
                      {{ $tc('Transfer contacts') }}
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
              </template>
              <!-- Передача контактов -->

              <!-- Экспорт -->
              <template v-if="dataTableContacts.selected.length > 0">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      text
                      tile
                      small
                    >
                      {{ $tc('Export') }}
                    </v-btn>
                  </template>
                  <v-list
                    class="py-0"
                    tile
                  >
                    <v-list-item
                      link
                      disabled
                      @click="onExportClick('csv')"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ $tc('Export to CSV') }}</v-list-item-title>
                        <v-list-item-subtitle>{{ $tc('Text format') }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      link
                      @click="onExportClick('excel')"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ $tc('Export to Excel') }}</v-list-item-title>
                        <v-list-item-subtitle>{{ $tc('Office Open XML (.xlsx, .xls) Excel 2007, Excel 97 and above') }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <!-- Экспорт -->

              <!--              &lt;!&ndash; Archived &ndash;&gt;-->
              <!--              <template v-if="dataTableContacts.selected.length > 0">-->
              <!--                <v-btn-->
              <!--                  :disabled="dataTableContacts.processLoading"-->
              <!--                  small-->
              <!--                  tile-->
              <!--                  text-->
              <!--                  @click="onButtonRefreshClick"-->
              <!--                >-->
              <!--                  {{ $tc('Архивировать') }}-->
              <!--                </v-btn>-->
              <!--              </template>-->
              <!--              &lt;!&ndash; Archived &ndash;&gt;-->

              <v-spacer/>

              <!-- Paginator -->
              <app-pagination
                v-model="dataTableContacts.page"
                :length="dataTableContacts.pages"
                :disabled="dataTableContacts.processLoading || dataTableContacts.selectedWhole"
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
                        {{ dataTableContacts.pageStart }}-{{ dataTableContacts.pageStop }} из {{ dataTableContacts.totalCount }}
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
            <v-fade-transition>
              <v-banner
                v-if="dataTableContacts.selectedAll && !dataTableContacts.selectedIndeterminate"
                class="mb-1 text-center"
                outlined
                single-line
                sticky
              >
                <div>
                  <span style="font-size: 14px; font-weight: 500;">
                  {{$tc('All chains selected ({n}) on the page.', dataTableContacts.selectedWhole ? dataTableContacts.totalCount : dataTableContacts.selected.length) }}
                </span>
                  <v-btn
                    color="primary"
                    class="ml-2"
                    small
                    text
                    tile
                    @click="dataTableContacts.selectedWhole = !dataTableContacts.selectedWhole"
                  >
                    {{ dataTableContacts.selectedWhole ? $tc('Cancel') : $tc('Select all') }}
                  </v-btn>
                </div>
              </v-banner>
            </v-fade-transition>

            <!-- Прогресс импорта -->
            <v-fade-transition>
              <v-banner
                v-if="importExportProgress.visible"
                class="mb-1"
                single-line
                sticky
              >
                <v-progress-linear
                  v-model="importExportProgress.value"
                  :indeterminate="importExportProgress.value < 0"
                  height="10"
                >
                </v-progress-linear>
              </v-banner>
            </v-fade-transition>
            <!-- Прогресс импорта -->
            <!-- Банеры -->

          </template>

          <template slot="item" slot-scope="{ item }">
            <tr class="v-datatable-item">
              <td class="text-no-wrap">
                <v-checkbox
                  v-model="dataTableContacts.selected"
                  :ripple="false"
                  :value="item.id"
                  :disabled="dataTableContacts.selectedWhole"
                  class="ma-0 pa-0"
                  multiple
                  hide-details
                  dense
                />
              </td>
              <td class="text-no-wrap">
                <router-link :to="{ name: 'administrator_contacts_view', params: { contact_id: item.id } }">
                  {{ item.last_name }} {{ item.first_name }} {{ item.middle_name }}
                </router-link>
              </td>
              <td class="text-no-wrap">
                {{ item.responsible ? `${item.responsible.first_name} ${item.responsible.last_name}` : '—' }}
              </td>
              <td class="text-no-wrap">
                {{ item.project ? item.project.name : '—' }}
              </td>
              <td class="text-no-wrap">
                  <span v-if="item.last_call_at">
                      {{ $moment.unix(item.last_call_at).format('Do MMMM YYYY, в h:mm:ss a') }}
                    </span>
                <span v-else>
                      —
                    </span>
              </td>
              <td class="text-no-wrap">
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
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>

      <!-- Фильтры -->
      <v-col
        cols="3"
      >
        <v-card
          class="fill-height"
          flat
          tile
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

    <input ref="fileInput" type="file" name="name" style="display: none;"/>
  </v-card>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { ContactExportParamsInterface, Contacts } from '@/api/Contacts'
import { ProjectInterface } from '@/api/Projects'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import { UserInterface } from '@/api/Users'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
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
    AppPagination,
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
        itemsPerPage: 50,
        pageStart: 0,
        pageStop: 0,
        headers: [
          { text: ' ', align: 'start', sortable: true, value: 'checkbox', width: '40px' },
          { text: this.$tc('Client'), align: 'start', sortable: true, value: 'client', width: '100%' },
          { text: this.$tc('Responsible'), align: 'start', sortable: true, value: 'responsible', width: 'auto' },
          { text: this.$tc('Project'), align: 'start', sortable: true, value: 'project', width: 'auto' },
          {
            text: this.$tc('Date and time of the last call'),
            align: 'start',
            sortable: true,
            value: 'last_call_at',
            width: '133px'
          },
          { text: '', align: 'end', sortable: false, value: 'actions', width: '88px' }
        ],
        selectedAll: false,
        selectedWhole: false,
        selectedIndeterminate: false,
        selected: [],
        items: [] as unknown & ContactInterface[]
      },
      // Прогресс импорта
      importExportProgress: {
        visible: false,
        value: 0
      }
    }
  },

  watch: {
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
      handler (selected: number[]) {
        if (selected.length === this.dataTableContacts.itemsPerPage) {
          this.dataTableContacts.selectedAll = true
        } else if (selected.length === 0) {
          this.dataTableContacts.selectedAll = false
        }

        this.dataTableContacts.selectedIndeterminate = this.dataTableContacts.selected.length < this.dataTableContacts.items.length && this.dataTableContacts.selected.length > 0
      }
    }
  },

  computed: {
    // Вычисляю высоту таблицы
    vCardHeightComputed () {
      const h = 600
      return h
    },
    // Вычисляю высоту таблицы
    vDataTableHeightComputed () {
      const h = this.$screenHeight - 150
      return h
    }
  },

  mounted () {
    this.initializeFilters()
  },

  methods: {
    fetchContacts () {
      this.dataTableContacts.processLoading = true
      let offset = (this.dataTableContacts.itemsPerPage * this.dataTableContacts.page) - this.dataTableContacts.itemsPerPage

      if (offset < 0) {
        offset = 0
      }

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
        .find<{ count: number }, ContactInterface[]>(params)
        .then((response) => {
          this.dataTableContacts.totalCount = response.meta.count
          this.dataTableContacts.pages = Math.ceil(response.meta.count / this.dataTableContacts.itemsPerPage)
          this.dataTableContacts.items = response.data
        }).finally(() => (this.dataTableContacts.processLoading = false))
    },

    /**
     * При клике на кнопку "Импортировать"
     **/
    onImportClick (format: 'excel' | 'csv') {
      let accept = ''
      switch (format) {
        case 'csv': {
          accept = '.csv'
          break
        }
        case 'excel': {
          accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
          break
        }
        default: {
          return this.$toast.error('Import successfully')
        }
      }

      this.$fileDialog.open({
        accept,
        multiple: false
      }).then((file: FileList | File) => {
        if (file instanceof File) {
          this.importExportProgress.visible = true
          new Contacts()
            .import(file, (event: ProgressEvent) => {
              this.importExportProgress.value = event.loaded / event.total * 100
            })
            .then((response) => {
              this.$toast.success('Импортировано ' + response.data.count_insert_contacts)
              this.fetchContacts()
            }).catch((error: Error) => {
              this.$toast.error(error.message)
            }).finally(() => {
            // Для того, что бы увидит 100%
              setTimeout(() => {
                this.importExportProgress.visible = false
              }, 500)
            })
        }
      })
    },

    /**
     * При клике на кнопку "Экспортировать"
     **/
    onExportClick (format: 'excel' | 'csv') {
      switch (format) {
        case 'csv': {
          break
        }
        case 'excel': {
          break
        }
        default: {

        }
      }

      const params: ContactExportParamsInterface = {
        filters: [],
        format,
        target_contacts: this.dataTableContacts.selectedWhole ? [] : this.$data.dataTableContacts.selected
      }

      // Задачи
      if (this.$data.filter.task.selected) {
        params.filters.push({
          name: 'tasks',
          value: this.$data.filter.task.selected
        })
      }

      // Проекты
      if (this.$data.filter.project) {
        params.filters.push({
          name: 'project_id',
          value: this.$data.filter.project.id
        })
      }

      // Ответственный
      if (this.$data.filter.responsible) {
        params.filters.push({
          name: 'responsible_id',
          value: this.$data.filter.responsible.id
        })
      }

      // Дата последнего звонка
      if (this.$data.filter.last_call_at.selected) {
        params.filters.push({
          name: 'last_call_at',
          value: this.$data.filter.last_call_at.selected
        })
      }

      // Дата создания контакта
      if (this.$data.filter.contact_create_date) {
        params.filters.push({
          name: 'contact_create_date',
          value: this.$moment(this.$data.filter.contact_create_date, 'YYYY-MM-DD', false).unix()
        })
      }

      this.importExportProgress.value = true
      this.importExportProgress.value = -1 // Неопределённый
      new Contacts()
        .export(params)
        .finally(() => {
          this.importExportProgress.value = false
          this.importExportProgress.value = 0
        })
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
      this.dataTableContacts.pageStart = data.pageStart
      this.dataTableContacts.pageStop = data.pageStop
    },

    /**
     * Инициализация фильтров
     **/
    initializeFilters () {
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

      if (this.$route.query.task) {
        this.$data.filter.task.selected = this.$route.query.task
      }

      if (+this.$route.query.page) {
        this.$data.dataTableContacts.page = +this.$route.query.page
      }

      // Инициализирую слежку за состоянием фильтров после того как будут проинициализированы все фильтры
      // Загружаем данные контактов после инициализации фильтров
      Promise.all(promises)
        .finally(() => {
          this.fetchContacts()
          this.initializeWatchForFilters()
        })
    },

    /**
     * Инициализировать слежку за изменением фильтров
     */
    initializeWatchForFilters () {
      const debounceDelay = 350 // Задержка, избавит от дребезга

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
      this.$watch('filter.last_call_at.selected', debounce((newVal: string) => {
        if (newVal) {
          this.$routerQuery.setQuery({
            last_call_at: newVal
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

      // Пагинация
      this.$watch('dataTableContacts.page', debounce((newVal: number) => {
        if (newVal) {
          this.$routerQuery.setQuery({
            page: newVal
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'page'
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

<template>
  <v-card
    flat
    tile
  >
    <v-row>
      <!-- Основная таблица -->
      <v-col
        cols="9"
      >
        <v-data-table
          v-model="dataTableContacts.selected"
          :headers="dataTableContacts.headers"
          :items="dataTableContacts.items"
          :server-items-length="dataTableContacts.totalCount"
          :page.sync="dataTableContacts.page"
          :items-per-page="contact_list_per_page"
          :loading-text="$tc('Loading content...')"
          :loading="dataTableContacts.processLoading"
          :no-data-text="$tc('No data available')"
          :options.sync="dataTableContacts.options"
          :item-class="vDataTableItemClass"
          :sort-by.sync="dataTableContacts.sortBy"
          :sort-desc.sync="dataTableContacts.sortDesc"
          :show-select="dataTableContacts.totalCount > 0"
          id="v-data-table"
          selectable-key="id"
          item-key="id"
          calculate-widths
          multi-sort
          fixed-header
          hide-default-footer
          dense
          @pagination="onPaginationChange"
        >
          <template slot="header.data-table-select" slot-scope="{ on, props }">
            <v-simple-checkbox
              v-model="props.value"
              v-on="on"
              :indeterminate="props.indeterminate"
              @contextmenu="unselectAll"
            />
          </template>

          <template v-slot:top>
            <v-toolbar
              class="v-toolbar-header mb-2"
              height="48"
              flat
            >

              <template v-if="dataTableContacts.selected.length === 0">
                <v-btn
                  small
                  tile
                  text
                  @click="onContactAddClick"
                >
                  {{ $tc('Add') }}
                </v-btn>
              </template>

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

              <!-- Установка тегов -->
              <template v-if="dataTableContacts.selected.length > 0">
                <v-menu
                  v-model="menuSetTagsShowing"
                  :close-on-click="false"
                  :close-on-content-click="false"
                  :disabled="process === 'setting-tags'"
                  offset-y
                  @input="onMenuSetTegInputChange"
                  @keydown.esc="menuSetTagsShowing = false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      text
                      small
                      tile
                    >
                      {{ $tc('Set tags') }}
                    </v-btn>
                  </template>
                  <v-card tile>
                    <v-card-text class="px-2">
                      <app-search-input
                        v-model="tagName"
                        :label="$tc('Search tags')"
                        :outlined="false"
                        @change="onSearchInputChange"
                      />
                    </v-card-text>
                    <v-card-text
                      class="px-0 py-1"
                      style="max-height: 300px; overflow-y: auto"
                    >
                      <template v-if="tagsAvailableForSet.length > 0">
                        <v-list dense>
                          <v-list-item-group
                            v-model="tagsSelectedForSet"
                            multiple
                          >
                            <v-list-item
                              v-for="(item, key) in tagsAvailableForSet"
                              :key="key"
                              dense
                              link
                              selectable
                            >
                              <template v-slot:default="{ active }">
                                <v-list-item-action class="ma-0 mr-3">
                                  <v-checkbox
                                    :input-value="active"
                                    class="pa-0"
                                    dense
                                  ></v-checkbox>
                                </v-list-item-action>
                                <v-list-item-content>
                                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                                </v-list-item-content>
                              </template>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </template>
                      <template v-else>
                        <div class="text-center">
                          No data
                        </div>
                      </template>
                    </v-card-text>
                    <v-card-text class="px-0 py-0">
                      <v-divider />
                    </v-card-text>
                    <!-- Действия тегов -->
                    <v-card-text class="px-0 py-0">
                      <v-list dense>
                        <template v-if="tagsSelectedForSet.length === 0">
                          <v-list-item
                            dense
                            link
                            @click="onCreateTagClick(tagName)"
                          >
                            <v-list-item-title v-if="tagName && tagsAvailableForSet.length === 0">"{{ tagName }}" {{ $tc('Create') }}</v-list-item-title>
                            <v-list-item-title v-else>{{ $tc('Create') }}</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            dense
                            link
                            disabled
                          >
                            <v-list-item-title>{{ $tc('Tag management') }}</v-list-item-title>
                          </v-list-item>
                        </template>
                        <template v-else>
                          <v-list-item
                            :disabled="process === 'setting-tags'"
                            dense
                            link
                            @click="tagsSelectedApplyClick(tagsSelectedForSet.map((value) => tagsAvailableForSet[value]))"
                          >
                            <v-list-item-title>{{ $tc('Apply') }}</v-list-item-title>
                          </v-list-item>
                        </template>
                        <v-list-item
                          :disabled="process === 'setting-tags'"
                          dense
                          link
                          @click="menuSetTagsShowing = false"
                        >
                          <v-list-item-title>{{ $tc('Cancel') }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                    <!-- Действия тегов -->
                  </v-card>
                </v-menu>
              </template>
              <!-- Установка тегов -->

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
                        <app-count-up
                          :end-val="dataTableContacts.pageStart"
                        />
                        <span class="mx-1">—</span>
                        <app-count-up
                          :end-val="dataTableContacts.pageStop"
                        />
                        <span class="mx-1">из</span>
                        <app-number-format
                          :value="dataTableContacts.totalCount"
                        />
                      </v-btn>
                    </template>
                    <v-list
                      :disabled="dataTableContacts.pages < 4"
                      v-ripple="false"
                      class="py-0"
                      dense
                      flat
                    >
                      <v-list-item
                        link
                        @click="dataTableContacts.page = 1"
                      >
                        <v-list-item-content>
                          <v-list-item-title>Самые новые</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        link
                        @click="dataTableContacts.page = Math.floor(dataTableContacts.pages/2)"
                      >
                        <v-list-item-content>
                          <v-list-item-title>Между новыми и старыми</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        link
                        @click="dataTableContacts.page = dataTableContacts.pages - 1"
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
                v-if="dataTableContacts.selectedAll"
                class="mb-1 text-center"
                outlined
                single-line
                sticky
              >
                <div>
                  <span style="font-size: 14px; font-weight: 500;">
                  {{ $tc('All chains selected ({n}) on the page.', dataTableContacts.selectedWhole ? dataTableContacts.totalCount : dataTableContacts.selected.length) }}
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
                  <v-btn
                    color="primary"
                    class="ml-2"
                    small
                    text
                    tile
                    @click="unselectAll"
                  >
                    {{ $tc('Cancel selection')  }}
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

          <template slot="item.contact" slot-scope="{ item }">
            <router-link :to="{ name: 'administrator_contacts_view', params: { contact_id: item.id } }">
              {{ item.last_name }} {{ item.first_name }} {{ item.middle_name }}
            </router-link>
          </template>

          <template slot="item.responsible" slot-scope="{ value }">
            <template v-if="value">
              {{ value.last_name }} {{ value.first_name }}
            </template>
            <template v-else>
              —
            </template>
          </template>

          <template slot="item.project" slot-scope="{ value }">
            <template v-if="value">
              {{ value.name }}
            </template>
          </template>

          <template slot="item.last_call_at" slot-scope="{ value }">
            <template v-if="value">
              {{ $moment.unix(value).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
            </template>
          </template>

          <template slot="item.actions" slot-scope="{ item }">
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
              @click.stop="onItemEditClick(item.id)"
            >
              <v-icon>mdi-pencil-box-outline</v-icon>
            </v-btn>
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
          <!-- Проекты -->
          <v-card-text>
            <v-text-field
              v-model="filter.q"
              :label="$tc('Search by name')"
              prepend-inner-icon="mdi-magnify"
              clearable
              outlined
              dense
            />
          </v-card-text>

          <!-- Проекты -->
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

          <!-- Статусы -->
          <v-card-text class="pt-0">
            <s-statuses-select
              v-model="filter.status"
              :params="sStatusesParams"
              :disabled="!isActiveFilterStatus"
              ref="sStatusesSelect"
              clearable
              outlined
              dense
              multiple
            />
          </v-card-text>

          <!-- Ответственный -->
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

          <!-- Теги -->
          <v-card-text class="pt-0">
            <s-contact-tags
              v-model="filter.tags"
              :label="$tc('Tags')"
              clearable
              outlined
              dense
              multiple
              notags
            />
          </v-card-text>

          <!-- Задачи -->
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

          <!-- Прозвонено -->
          <v-card-text class="pt-0">
            <v-select
              v-model="filter.call_up.selected"
              :items="filter.call_up.options"
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

          <!-- Дата создания контакта -->
          <v-card-text class="pt-0">
            <h4>{{ $tc('Дата создания контакта') }}</h4>
            <v-date-picker
              v-model="filter.contact_created_at.value"
              :first-day-of-week="1"
              :range="filter.contact_created_at.range"
              locale="ru"
              flat
              no-title
              scrollable
              full-width
            >
              <v-switch
                v-model="filter.contact_created_at.range"
                :label="$tc('Range')"
                @click="filter.contact_created_at.value = null"
              />
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="filter.contact_created_at.value = null"
              >
                {{ $tc('Clear') }}
              </v-btn>
            </v-date-picker>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { ContactExportParamsInterface, Contacts, ContactsParamsFind } from '@/api/Contacts'
import { StatusInterface } from '@/api/Database'
import { ProjectInterface } from '@/api/Projects'
import {
  ContactEmailInterface,
  ContactInterface,
  ContactPhoneInterface,
  ContactTagInterface
} from '@/api/Schemas/ContactInterface'
import { UserInterface } from '@/api/Users'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppNumberFormat from '@/components/AppNumberFormat/AppNumberFormat.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import AppSearchInput from '@/components/AppSearchInput/AppSearchInput.vue'
import { ContactInterface as SCEContactInterface } from '@/snippets/SContactEditor/interfaces'
import SContactDialogEditor from '@/snippets/SContactEditor/SContactDialogEditor.vue'
import SContactTransferDialog, { SContactTransferScopeInterface } from '@/snippets/SContactTransferDialog/SContactTransferDialog.vue'
import SContactTags from '@/snippets/SContactTags/SContactTags.vue'
import SContactTagsEditDialog from '@/snippets/SContactTagsEditDialog/SContactTagsEditDialog.vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import SStatusesSelect from '@/snippets/SStatusesSelect/SStatusesSelect.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import { DataOptions } from 'vuetify'
import { debounce } from 'vuetify/src/util/helpers'

interface IRefs {
  sProjectsAutocomplete: any
  sUsersAutocomplete: any

  [key: string]: any;
}

interface IData {
  process: null | 'setting-tags'
  [key: string]: any;
}

interface VInnerInterface extends VInterface {
  $refs: IRefs
  $data: IData
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: {
    AppNumberFormat,
    AppCountUp,
    AppPagination,
    AppSearchInput,
    SContactTags,
    SProjectsAutocomplete,
    SStatusesSelect,
    SUsers
  },

  computed: {
    contact_list_per_page: {
      get () {
        return this.$store.getters['settings/contact_list'].count_per_page
      },

      set (value: number) {
        return this.$store.commit('settings/contact_list_count_per_page', value)
      }
    },

    // Текущие фильтры для запроса на сервер.
    paramFilters () {
      const params: any = {}

      // Задачи
      if (this.$data.filter.task.selected) {
        switch (this.$data.filter.task.selected) {
          case 'available':
          case 'unavailable':
          case 'overdue':
          case 'not_overdue':
            params.tasks = this.$data.filter.task.selected
            break
        }
      }

      // Проекты
      if (this.$data.filter.project) {
        params.project_id = this.$data.filter.project.id
      }

      // Теги
      if (this.$data.filter.tags.length > 0) {
        params.tag_ids = this.$data.filter.tags.join(',')
      }

      // Ответственный
      if (this.$data.filter.responsible) {
        params.responsible_id = this.$data.filter.responsible.id
      }

      // Статусы
      if (this.$routerQuery.hasQuery('status_ids')) {
        params.status_ids = this.$routerQuery.getQuery<string>('status_ids')
      }

      // Дата последнего звонка
      if (this.$data.filter.call_up.selected) {
        switch (this.$data.filter.call_up.selected) {
          case 'yes':
            params.call_up = 1
            break
          case 'no':
            params.call_up = 0
            break
        }
      }

      // Дата создания контакта
      if (this.$data.filter.contact_created_at.value) {
        if (Array.isArray(this.$data.filter.contact_created_at.value)) {
          if (this.$data.filter.contact_created_at.value.length === 2) {
            params.contact_created_at = this.$data
              .filter
              .contact_created_at
              .value
              .map((value: string) => this.$moment(value, 'YYYY-MM-DD').unix())
              .sort((a: number, b: number) => a - b)
              .join(',')
          }
        } else if (this.$data.filter.contact_created_at.value) {
          params.contact_created_at = this.$moment(this.$data.filter.contact_created_at.value, 'YYYY-MM-DD', false).unix()
        }
      }

      return params
    },

    sStatusesParams () {
      return this.filter.project?.id ? {
        project_id: this.filter.project?.id
      } : {}
    },

    isActiveFilterStatus () {
      return Boolean(this.filter.project?.id)
    },

    paramsSort (): unknown[] & { sort_by: string, sort_desc: boolean }[] {
      const json: string = this.$routerQuery.getQuery<string>('sort', '[]')
      return JSON.parse(json)
    },

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

  data (): IData {
    return {
      /** Показать/скрыть меню установки тегов */
      menuSetTagsShowing: false,
      /** Доступные теги для установки */
      tagsAvailableForSet: [] as ContactTagInterface[],
      /** Выбранные теги для установки */
      tagsSelectedForSet: [] as number[],
      tagName: '' as string,

      dataTableContacts: {
        headers: [
          {
            align: 'start',
            class: '',
            divider: true,
            sortable: true,
            text: this.$tc('Client'),
            value: 'contact',
            width: '100%'
          },
          {
            align: 'start',
            class: '',
            divider: true,
            sortable: true,
            text: this.$tc('Responsible'),
            value: 'responsible',
            width: 'auto'
          },
          {
            align: 'start',
            class: '',
            divider: true,
            sortable: true,
            text: this.$tc('Project'),
            value: 'project',
            width: 'auto'
          },
          {
            align: 'start',
            class: '',
            sortable: true,
            text: this.$tc('Date and time of the last call'),
            value: 'last_call_at',
            width: 'auto'
          },
          {
            align: 'end',
            class: '',
            sortable: false,
            text: '',
            value: 'actions',
            width: 'auto'
          }
        ],
        items: [] as unknown & ContactInterface[],
        options: {} as DataOptions,
        page: 1,
        pageStart: 0,
        pageStop: 0,
        pages: 0,
        processLoading: false,
        selected: [] as ContactInterface[],
        selectedAll: false,
        selectedWhole: false,
        selectedCount: 0,
        sortBy: [],
        sortDesc: [],
        totalCount: 0
      },

      /** Поиск контактов **/
      fetchContacts: debounce(() => {
        this.dataTableContacts.processLoading = true
        let offset = (this.contact_list_per_page * this.dataTableContacts.page) - this.contact_list_per_page

        if (offset < 0) {
          offset = 0
        }

        const params: ContactsParamsFind = {
          count: this.contact_list_per_page,
          fields: 'responsible,organization,project',
          offset
        }

        if (this.$routerQuery.hasQuery('project_id')) {
          params.project_id = this.$routerQuery.getQuery<number>('project_id')
        }

        if (this.$routerQuery.hasQuery('status_ids')) {
          params.status_ids = this.$routerQuery.getQuery<string>('status_ids')
        }

        if (this.$routerQuery.hasQuery('responsible_id')) {
          params.responsible_id = this.$routerQuery.getQuery<number>('responsible_id')
        }

        if (this.$routerQuery.hasQuery('call_up')) {
          switch (this.$routerQuery.getQuery<'yes' | 'no'>('call_up')) {
            case 'yes': {
              params.call_up = 1
              break
            }
            case 'no': {
              params.call_up = 0
              break
            }
          }
        }

        if (this.$routerQuery.hasQuery('contact_created_at')) {
          params.contact_created_at = this.$routerQuery.getQuery('contact_created_at')
        }

        if (this.$routerQuery.hasQuery('task')) {
          params.task = this.$routerQuery.getQuery('task')
        }

        if (this.$routerQuery.hasQuery('tag_ids')) {
          params.tag_ids = this.$routerQuery.getQuery('tag_ids')
        }

        // Формирую параметры сортировки
        this.dataTableContacts.sortBy.forEach((name: string, index: number) => {
          params[`sort_by[${name}]`] = this.dataTableContacts.sortDesc[index] ? 'desc' : 'asc'
        })

        // Поиск по ключевому слову
        if (this.$data.filter.q) {
          params.q = this.filter.q
        }

        new Contacts()
          .find<{ count: number }, ContactInterface[]>(params)
          .then((response) => {
            this.dataTableContacts.totalCount = response.meta.count
            this.dataTableContacts.pages = Math.ceil(response.meta.count / this.contact_list_per_page)
            this.dataTableContacts.items = response.data
          }).finally(() => (this.dataTableContacts.processLoading = false))
      }, 500),

      filter: {
        // Фильтрация по наличию последнего звонка
        call_up: {
          options: ['yes', 'no'],
          selected: null as 'yes' | 'no' | null
        },

        // Фильтрация по дате создания контакта
        contact_created_at: {
          range: false,
          value: null as unknown & number | number[]
        },

        // Фильтрация по проектам
        project: null,

        // Поиск
        q: null as string | null,

        // Фильтрация по владельцу/ответственному
        responsible: null,

        // Фильтрация по тегам
        tags: [] as ContactTagInterface[],

        // Фильтрация по статусам
        status: [] as unknown & StatusInterface[],

        // Фильтрация по задачам
        task: {
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
          ],
          selected: null as 'available' | 'unavailable' | 'overdue' | 'not_overdue' | null
        }
      },

      // Прогресс импорта
      importExportProgress: {
        value: 0,
        visible: false
      },
      process: null
    }
  },

  methods: {

    /**
     * Инициализация фильтров
     **/
    initializeFilters () {
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

      if (this.$routerQuery.hasQuery('status_ids')) {
        const status_ids = this.$routerQuery.getQuery<string>('status_ids').split(',')
        this.filter.status = status_ids.map(value => +value)
      }

      if (this.$routerQuery.hasQuery('responsible_id')) {
        promises.push(this.$refs.sUsersAutocomplete.setDefault(this.$routerQuery.getQuery('responsible_id')))
      }

      this.filter.call_up.selected = this.$routerQuery.getQuery<string>('call_up', '')

      // Инициализация фильтров
      if (this.$routerQuery.hasQuery('contact_created_at')) {
        const date = this.$routerQuery.getQuery<string>('contact_created_at')
        if (/^(\d+),(\d+)$/s.test(date)) {
          // Диапазон
          this.filter.contact_created_at.range = true
          this.filter.contact_created_at.value = date.split(',', 2)
            .sort((a: string, b: string) => +a - +b)
            .map((value: string) => {
              return this.$moment.unix(+value).format('YYYY-MM-DD')
            })
        } else if (/^d+$/s.test(date)) {
          this.filter.contact_created_at.value = this.$moment.unix(date).format('YYYY-MM-DD')
        } else {
          this.filter.contact_created_at.value = this.$moment.unix(date).format('YYYY-MM-DD')
        }
      }

      if (this.$route.query.task) {
        this.$data.filter.task.selected = this.$route.query.task
      }

      if (+this.$route.query.page) {
        this.$data.dataTableContacts.page = +this.$route.query.page
      }

      // Восстановление параметров сортировки после перезагрузки страницы
      if (this.$routerQuery.hasQuery('sort')) {
        this.paramsSort.forEach((e: unknown & { sort_by: string, sort_desc: boolean }) => {
          this.$data.dataTableContacts.options.sortBy.push(e.sort_by)
          this.$data.dataTableContacts.options.sortDesc.push(e.sort_desc)
        })
      }

      if (this.$routerQuery.hasQuery('q')) {
        this.filter.q = this.$routerQuery.getQuery<string>('q')
      }

      if (this.$routerQuery.hasQuery('tag_ids')) {
        const tag_ids = this.$routerQuery.getQuery<string>('tag_ids').split(',')
        this.filter.tags = tag_ids.map(value => +value)
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

      // Поиск по ключевым словам
      this.$watch('filter.q', (newVal?: string) => {
        this.dataTableContacts.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            q: newVal
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'q'
          ]).then(this.fetchContacts)
        }
      })

      // Фильтрация по проектам
      this.$watch('filter.project', (newVal: unknown & ProjectInterface) => {
        this.dataTableContacts.page = 1
        if (this.assertObjectHasAttribute(newVal, 'id')) {
          this.$routerQuery.setQuery({
            project_id: newVal.id
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'project_id',
            'status_ids'
          ]).then(this.fetchContacts)
        }
      })

      // Фильтрация по статусам
      this.$watch('filter.status', (newVal: unknown & StatusInterface[]) => {
        this.dataTableContacts.page = 1
        if (Array.isArray(newVal)) {
          this.$routerQuery.setQuery({
            status_ids: newVal.map(val => val.id).join(',')
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'status_ids'
          ]).then(this.fetchContacts)
        }
      })

      // Фильтрация по ответственным
      this.$watch('filter.responsible', (newVal: unknown & UserInterface) => {
        this.dataTableContacts.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            responsible_id: newVal.id
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'responsible_id'
          ]).then(this.fetchContacts)
        }
      })

      // Фильтр Задачи
      this.$watch('filter.task.selected', (newVal: unknown & string) => {
        this.dataTableContacts.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            task: newVal
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'task'
          ]).then(this.fetchContacts)
        }
      })

      // Фильтр прозвона
      this.$watch('filter.call_up.selected', (newVal: string) => {
        this.dataTableContacts.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            call_up: newVal
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'call_up'
          ]).then(this.fetchContacts)
        }
      })

      // Фильтрация по дате создания контакта
      this.$watch('filter.contact_created_at.value', (newVal: string | string[]) => {
        if (!newVal) {
          this.$routerQuery.removeQuery([
            'contact_created_at'
          ]).then(this.fetchContacts)
        }

        let value = ''
        if (Array.isArray(newVal)) {
          if (newVal.length < 2) {
            return
          }

          value = newVal.map((value: string) => this.$moment(value)
            .unix())
            .sort((a: number, b: number) => a - b)
            .join(',')
        } else {
          value = this.$moment(newVal).unix()
        }

        this.dataTableContacts.page = 1
        this.$routerQuery.setQuery({
          contact_created_at: value
        }).then(this.fetchContacts)
      })

      // Фильтрация по тегам
      this.$watch('filter.tags', (value: number[]) => {
        if (!Array.isArray(value)) {
          this.$routerQuery.removeQuery([
            'tag_ids'
          ]).then(this.fetchContacts)
        }

        this.dataTableContacts.page = 1
        this.$routerQuery.setQuery({
          tag_ids: value.join(',')
        }).then(this.fetchContacts)
      })

      // Пагинация
      this.$watch('dataTableContacts.page', (newVal: number) => {
        if (newVal) {
          this.$routerQuery.setQuery({
            page: newVal
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'page'
          ]).then(this.fetchContacts)
        }
      })

      // АТОМАРНОЕ ОБНОВЛЕНИЕ СОРТИРОВКИ

      /**
       * Функция, реагирующая на изменение свойств sortDesc, sortDesc объекта dataTableContacts
       */
      const dataTableSortUpdate = debounce(() => {
        const sort = []
        for (let i = 0; i < Math.min(this.dataTableContacts.sortBy.length, this.dataTableContacts.sortDesc.length); i++) {
          const sortDesc: string = this.dataTableContacts.sortDesc[i]
          const sortBy: boolean = this.dataTableContacts.sortBy[i]

          sort.push({ sort_by: sortBy, sort_desc: sortDesc })
        }

        if (sort.length > 0) {
          // Преобразовываю в JSON и сохраняю в строку браузера
          this.$routerQuery.setQuery({
            sort: JSON.stringify(sort)
          }).then(() => {
            this.fetchContacts()
          })
        } else {
          this.$routerQuery
            .removeQuery(['sort'])
            .then(() => {
              this.fetchContacts()
            })
        }
      }, debounceDelay)

      // Поля, по которым буду осуществлять сортировку
      this.$watch('dataTableContacts.sortBy', dataTableSortUpdate)
      // Направление сортировки
      this.$watch('dataTableContacts.sortDesc', dataTableSortUpdate)
    },

    onButtonRefreshClick () {
      this.fetchContacts()
    },

    /**
     * Срабатывает когда нажали на кнопку добавить контакт.
     **/
    async onContactAddClick () {
      const instance = await this.$dialog.show(SContactDialogEditor, {
        on: {
          cancel: () => {
            instance.close()
          },
          save: (data: SCEContactInterface) => {
            new Contacts()
              .add({
                address: data.address,
                city: data.city,
                emails: data.emails,
                first_name: data.first_name,
                last_name: data.last_name,
                middle_name: data.middle_name,
                notes: data.notes,
                phones: data.phones,
                region: data.region,
                tags: data.tags
              }).then(() => {
                this.$toast.success(this.$tc('Contact created'))
                this.fetchContacts()
              }).finally(() => (instance.close()))
          }
        },
        title: 'Создание контакта',
        waitForResult: false,
        width: '60%'
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
        filters: this.paramFilters,
        format,
        target_contacts: this.dataTableContacts.selectedWhole ? [] : this.$data.dataTableContacts.selected.map((e: any) => e.id)
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

    onItemEditClick (id: number) {
      new Contacts()
        .getById(id)
        .then(async (response: ContactInterface) => {
          const instance = await this.$dialog.show(SContactDialogEditor, {
            on: {
              cancel: () => {
                instance.close()
              },

              /** @param data Новые данные контакта **/
              save: (data: SCEContactInterface) => {
                new Contacts()
                  .update(id, {
                    address: data.address,
                    city: data.city,
                    emails: data.emails,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    middle_name: data.middle_name,
                    notes: data.notes,
                    phones: data.phones,
                    region: data.region,
                    tags: data.tags
                  }).then(() => {
                    this.$toast.success(this.$tc('Contact updated'))
                  }).finally(() => (instance.close()))
              }
            },
            title: this.$tc('Editing a contact'),
            value: {
              address: response?.address,
              city: response?.city,
              created_at: response?.created_at,
              emails: response?.emails?.map((value: ContactEmailInterface) => {
                return {
                  id: value.id,
                  label: value.label,
                  value: value.value
                }
              }) || [],
              first_name: response?.first_name,
              last_name: response?.last_name,
              middle_name: response?.middle_name,
              notes: response?.notes,
              phones: response.phones?.map((value: ContactPhoneInterface) => {
                return {
                  id: value.id,
                  label: value.label,
                  value: value.raw
                }
              }) || [],
              region: response?.region,
              tags: Array.isArray(response?.tags) ? response.tags.map((value: ContactTagInterface) => {
                return {
                  color: value?.color || '',
                  id: value?.id,
                  name: value?.name || ''
                }
              }) : []
            } as SCEContactInterface,
            waitForResult: false,
            width: '60%'
          })
        })
    },

    onPaginationChange (data: any) {
      this.dataTableContacts.pageStart = data.pageStart
      this.dataTableContacts.pageStop = data.pageStop
    },

    /**
     * Событие onSearchInputChange запускается для элемента поиска тегов ждя установки контактам,
     * когда пользователь фиксирует изменение значения элемента.
     */
    onSearchInputChange (q?: string) {
      if (typeof q === 'string') {
        new Contacts()
          .getTags({ q })
          .then((response) => {
            this.tagsAvailableForSet = response.data || []

            // Очистить выбранные теги, если в списке доступных тегов пуст
            if (this.tagsAvailableForSet.length === 0) {
              this.$data.tagsSelectedForSet = []
            }
          })
      }
    },

    /**
     * Событие onMenuSetTegInputChange запускается когда появляется меню установки тегов.
     * Событие будет реагировать на каждое изменение состояния меню.
     */
    onMenuSetTegInputChange (value: boolean) {
      // Заполни список если это происходит единожды.
      if (value && this.tagsAvailableForSet.length === 0) {
        new Contacts()
          .getTags()
          .then((response) => {
            this.tagsAvailableForSet = response.data
          })
      }
    },

    /**
     * Событие tagsSelectedApplyClick запускается после нажатия на кнопку "Применить" в списке тегов
     */
    tagsSelectedApplyClick (items: ContactTagInterface[]) {
      // Установи теги для контактов
      if (items.length > 0) {
        this.process = 'setting-tags'
        const contactSelected = this.$data.dataTableContacts.selected.map((value: ContactInterface) => value.id)
        new Contacts()
          .setTags({
            // Передайте пустой массив если нужно установить теги всем контактам
            contact_ids: this.$data.dataTableContacts.selectedWhole ? [] : contactSelected,
            filters: this.paramFilters,
            tag_ids: items.map((value: ContactTagInterface) => value.id)
          }).then((count: number) => {
            this.$toast.success(this.$tc('contacts_are_tagged', this.$data.dataTableContacts.selectedCount, {
              count,
              tags: items.map((value: ContactTagInterface) => value.name).join(', ') // Строка имён тегов разделённые запятой.
            }))
            this.tagsAvailableForSet = [] // Очистить список доступных тегов
            this.$data.tagsSelectedForSet = [] // Очистить список выбранных тегов
            this.$data.menuSetTagsShowing = false // Скрыть меню установки тегов
            this.$data.tagName = '' // Установить пустую строку для поисковой строки (строка поиска тегов)
          }).catch((e: APIError) => {
            this.$toast.error(this.$tc(e.message))
          }).finally(() => {
            this.$data.menuSetTagsShowing = false
          })
          .finally(() => {
            this.process = null
          })
      }
    },

    async onCreateTagClick (name: string) {
      const instance = await this.$dialog.show(SContactTagsEditDialog, {
        waitForResult: false,
        title: this.$tc('Create tag'),
        value: {
          name
        },
        on: {
          created: (id: number) => {
            new Contacts()
              .getTags({
                tag_ids: String(id)
              }).then((response) => {
                response.data.forEach(v => {
                  this.$data.tagsAvailableForSet.push({
                    id: v?.id,
                    name: v?.name,
                    color: v?.color
                  })
                })
              })

            instance.close()
          },

          cancel: () => {
            instance.close()
          }
        }
      })
    },

    /**
     * Передать контакты оператору в рамках текущего проекта
     */
    async onTransferContactToOperatorWithinProjectClick () {
      const instance = await this.$dialog.show(SContactTransferDialog, {

        onCancel: () => {
          instance.close()
        },

        // scope - набор опций для передачи контактов
        onTransfer: (scope: SContactTransferScopeInterface) => {
          const data: unknown & SContactTransferScopeInterface & { target_contacts: number[] } = {
            // Параметры фильтров
            filters: this.paramFilters,

            // Передайте пустой массив если хотите передать все контакты.
            target_contacts: this.dataTableContacts.selectedWhole ? [] : this.dataTableContacts.selected.map((e: any) => e.id),

            // Идентификаторы целевых пользователей.
            target_users: scope.target_users
          }

          // Опционально меняем дату, в scope.new_date timestamp
          if (this.assertObjectHasAttribute(scope, 'new_date')) {
            data.new_date = scope.new_date
          }

          new Contacts()
            .transfer(data)
            .then((count: number) => {
              this.$toast.success(this.$tc('Contacts not transferred | {n} contact transferred | {n} contact transferred | {n} contacts transferred', count))
              this.unselectAll()
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

        persistent: true,

        project_id: this.filter.project.id,

        subtitle: this.$tc('No contacts selected | {n} contact selected | {n} contact selected | {n} contacts selected', this.dataTableContacts.selected.length),

        waitForResult: false
      })
    },

    /**
     * Передать контакты в другой проект
     */
    async onTransferContactsToProjectClick () {
      this.$dialog.confirm({
        title: this.$tc('Confirmation request'),
        text: this.$tc('You are going to transfer a contact to another project, call history, tasks will not be transferred. The contact will be transferred as new. Do you confirm your actions?'),
        actions: {
          true: {
            text: this.$tc('Yes'),
            color: 'primary',
            key: true,
            value: true
          },
          false: {
            text: this.$tc('No')
          }
        }
      }).then(async (result: boolean) => {
        if (!result) return

        const instance = await this.$dialog.show(SContactTransferDialog, {

          onCancel: () => {
            instance.close()
          },

          // scope - набор опций для передачи контактов
          onTransfer: (scope: SContactTransferScopeInterface) => {
            const params: unknown & SContactTransferScopeInterface & {
              filters: unknown,
              target_contacts: number[],
              transfer_history: boolean
            } = {
              // Параметры фильтров.
              filters: this.paramFilters,
              // Передайте пустой массив если хотите передать все контакты.
              target_contacts: this.dataTableContacts.selectedWhole ? [] : this.dataTableContacts.selected.map((e: ContactInterface) => e.id),
              // Проект в который будут переданы контакты.
              target_project: scope.target_project,
              // Идентификаторы целевых пользователей.
              target_users: scope.target_users,
              // Не передавать историю.
              transfer_history: false
            }

            // Опционально меняем дату, в scope.new_date timestamp
            if (this.assertObjectHasAttribute(scope, 'new_date')) {
              params.new_date = scope.new_date
            }

            new Contacts()
              .transfer(params)
              .then((count: number) => {
                this.$toast.success(this.$tc('Contacts not transferred | {n} contact transferred | {n} contact transferred | {n} contacts transferred', count))
                this.dataTableContacts.selected = [] // Отменить выделение всех контактов
                instance.close() // Закрыть диалог
              })
              .catch((error) => {
                if (error instanceof APIError) {
                  error.errors.forEach((value) => {
                    this.$toast.error(this.$tc(value.message))
                  })
                  this.$toast.error(this.$tc(error.error_message))
                }
              })
              .finally(() => {
                this.fetchContacts() // Обновить список контактов
              })
          },
          persistent: true,
          subtitle: this.$tc('No contacts selected | {n} contact selected | {n} contact selected | {n} contacts selected', this.dataTableContacts.selected.length),
          waitForResult: false
        })
      })
    },

    selectAll () {
      this.$data.dataTableContacts.selectedAll = true
    },

    unselectAll (e?: Event) {
      if (e instanceof Event) {
        e.preventDefault()
      }
      this.$data.dataTableContacts.selected = []
    },

    vDataTableItemClass (scope: any) {
      return 'v-dt-item'
    }
  },

  mounted () {
    this.initializeFilters()
  },

  watch: {
    /**
     * Идентификаторы выделенных контактов
     *
     **/
    'dataTableContacts.selected': {
      handler (selected: UserInterface[]) {
        if (selected.length > 0 && selected.length <= this.dataTableContacts.totalCount) {
          this.dataTableContacts.selectedAll = true
        } else {
          this.dataTableContacts.selectedAll = false
          this.dataTableContacts.selectedWhole = false
        }

        if (this.dataTableContacts.selectedWhole) {
          this.dataTableContacts.selectedCount = this.dataTableContacts.totalCount
        } else {
          this.dataTableContacts.selectedCount = selected.length
        }
      }
    },

    // Идентификаторы выделенных контактов
    'dataTableContacts.selectedWhole': {
      handler (val: boolean) {
        if (val && JSON.stringify(this.paramFilters) === '{}') {
          this.unselectAll()
          this.$toast.warning(this.$tc('It is forbidden to select all elements without filters installed'))
        }
      }
    }
  }
})
</script>

<style lang="scss">
  .v-dt-item {
    & td {
      white-space:nowrap;
    }
  }
</style>

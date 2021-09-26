<template>
  <v-sheet>
    <v-row>
      <v-col
        cols="12"
        md="9"
        lg="9"
        order-xl="0"
        order-lg="0"
        order-md="0"
        order-sm="1"
      >
        <contacts-list @click:item:status="onContactListItemStatusClick">
          <template #head>
            <app-tools>
              <template #left>
                <v-btn
                  v-if="contactsSelected.length === 0"
                  small
                  tile
                  text
                  @click="onContactAddClick"
                >
                  {{ $tc('Add') }}
                </v-btn>
                <v-btn
                  v-if="contactsSelected.length === 0"
                  :disabled="contactsProcessLoading"
                  small
                  tile
                  text
                  @click="onBtnRefreshClick"
                >
                  {{ $tc('Refresh') }}
                </v-btn>
                <v-btn
                  v-if="contactsSelected.length > 0"
                  :disabled="contactsProcessLoading"
                  small
                  tile
                  text
                  @click="onBtnDeleteClick"
                >
                  {{ $tc('Delete') }}
                </v-btn>
                <v-btn
                  v-if="contactsSelected.length > 0 && $isGranted('TRANSFER_CONTACTS')"
                  small
                  tile
                  text
                  @click="onBtnTransferContactsClick"
                >
                  {{ $tc('Transfer contacts') }}
                </v-btn>
                <!-- Экспорт -->
                <template v-if="contactsSelected.length > 0 && $isGranted('IMPORT_EXPORT_CONTACTS')">
                  <v-menu offset-y>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        text
                        tile
                        small
                        v-on="on"
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
                        @click="onExportClick('xlsx')"
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
                <!-- Импорт -->
                <template v-if="$isGranted('IMPORT_EXPORT_CONTACTS')">
                  <v-menu offset-y>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        text
                        tile
                        small
                        v-on="on"
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
                <!-- Установка тегов -->
                <!-- TODO: Только для администраторов -->
                <app-menu-tags
                  v-if="contactsSelected.length > 0"
                  @update:apply="onAppMenuTagsApply"
                >
                  <template #activator="{ attrs, on }">
                    <v-btn
                      v-bind="attrs"
                      text
                      small
                      tile
                      v-on="on"
                    >
                      {{ $tc('Set tags') }}
                    </v-btn>
                  </template>
                </app-menu-tags>
                <!-- Установка тегов -->
              </template>
              <template #right>
                <app-pagination
                  v-model="offset"
                  :per-page="contactsPerPage"
                  :disabled="contactsProcessLoading"
                  :count="contactsTotal"
                />
                <app-btn-sorting
                  v-model="sortOption"
                  :label="$tc('Sorting')"
                  :items="sortingOptions"
                  :t="$tc"
                  item-text="name"
                  @change="onBtSortingChange"
                />
              </template>
            </app-tools>
          </template>
          <template #no-text>
            <div
              class="d-flex align-center justify-center"
              style="min-height: 500px"
            >
              <div class="pa-16 grey--text">
                <template v-if="contactListMessageError">
                  {{ contactListMessageError }}
                </template>
                <template v-else>
                  {{ $tc('Empty') }}
                </template>
              </div>
            </div>
          </template>
        </contacts-list>
      </v-col>

      <!-- Фильтры -->
      <v-col
        cols="12"
        md="3"
        lg="3"
        order-xl="1"
        order-lg="1"
        order-md="1"
        order-sm="0"
      >
        <v-sheet
          class="px-2 py-1"
        >
          <!-- Поиск -->
          <div>
            <app-search-input
              v-model="contactsParamsFilterQ"
              :label="$tc('Search')"
              @change="onFilterChange"
            />
          </div>
          <!-- Поиск -->

          <!-- Фильтр по проектам -->
          <div
            v-if="$isGranted(['ROLE_ADMIN', 'ROLE_RCC'])"
          >
            <app-project-autocomplete
              v-model="contactsParamsFilterProjectId"
              :label="$tc('Project')"
              :disabled="contactsProcessLoading"
              @change="onFilterChange"
            />
          </div>
          <!-- Фильтр по проектам -->

          <!-- Фильтр по статусам -->
          <div>
            <app-status-autocomplete
              v-model="filterStatusIds"
              :label="$tc('Result')"
              :disabled="contactsProcessLoading"
              :params="appStatusAutocompleteParams"
              multiple
              no-result-item
              @change="onFilterChange"
            />
          </div>
          <!-- Фильтр по статусам -->

          <!-- Фильтр группам пользователей -->
          <div
            v-if="$isGranted(['ROLE_ADMIN', 'ROLE_RCC'])"
          >
            <app-user-group-autocomplete
              v-model="filterUserGroupId"
              :label="$tc('Group')"
              :disabled="contactsProcessLoading"
              outlined
              dense
              @change="onFilterChange"
            />
          </div>
          <!-- Фильтр группам пользователей -->

          <!-- Фильтр по пользователям -->
          <div
            v-if="$isGranted(['ROLE_ADMIN', 'ROLE_RCC', 'ROLE_TEAM_LEADER'])"
          >
            <app-user-autocomplete
              v-model="filterUserId"
              :label="$tc('Responsible')"
              :disabled="contactsProcessLoading"
              @change="onFilterChange"
            />
          </div>
          <!-- Фильтр по пользователям -->

          <!-- Фильтр по наличию задач -->
          <div>
            <v-select
              v-model="filterTask"
              clearable
              :label="$tc('Tasks')"
              :items="filterTasksItems()"
              outlined
              dense
              @change="onFilterChange"
            />
          </div>
          <!-- Фильтр по наличию задач -->

          <!-- Фильтр по прозвонено/не прозвонено -->
          <div>
            <v-select
              v-model="filterCalling"
              label="Прозвонено"
              :items="filterCallingOptions"
              :disabled="contactsProcessLoading"
              clearable
              outlined
              dense
              @change="onFilterChange"
            >
              <template #selection="{ item }">
                {{ $tc(item.text) }}
              </template>
              <template #item="{ item }">
                {{ $tc(item.text) }}
              </template>
            </v-select>
          </div>
          <!-- Фильтр по прозвонено/не прозвонено -->

          <!-- Фильтр по тегам -->
          <div>
            <app-contact-tag-autocomplete
              v-model="filterTagIds"
              :label="$tc('Tags')"
              :disabled="contactsProcessLoading"
              :no-result-item-title="$tc('No tags')"
              no-result-item
              multiple
              @change="onFilterChange"
            />
          </div>
          <!-- Фильтр по тегам -->

          <div>
            <app-time-zone-autocomplete
              v-model="filterTimeZone"
              :label="$tc('Временная зона')"
              :disabled="contactsProcessLoading"
              @change="onFilterChange"
            />
          </div>

          <div>
            <app-menu-date-picker
              v-model="filterContactCreatedAt"
              :first-day-of-week="1"
              :t="$tc"
              :label="$tc('Date the contact was created')"
              :disabled="contactsProcessLoading"
              locale="ru"
              range
              @change="onFilterChange"
            />
          </div>
        </v-sheet>
      </v-col>
      <!-- Фильтры -->
    </v-row>

    <!-- Информационный Снэк-бар -->
    <v-snackbar
      v-if="contactsSelected.length > 0"
      :timeout="-1"
      :value="true"
      class="mt-12"
      color="primary"
      elevation="10"
      min-width="600"
      top
      centered
      :style="snackbarStyle"
    >
      <div
        class="d-flex align-center justify-lg-space-between"
        @mouseenter="snackbarStyle = { opacity: 1 }"
        @mouseleave="snackbarStyle = { opacity: 0.6 }"
      >
        <div>
          <div
            style="font-size: 14px"
          >
            Выбрано элементов (<app-count-up :end-val="contactsSelectedCount" />)
          </div>
        </div>
        <div>
          <v-btn
            text
            small
            tile
            @click="onBtnSelectAllClick"
          >
            {{ $tc('Select all') }}
          </v-btn>
          <v-btn
            text
            small
            tile
            @click="onBtnCancelSelectionClick"
            @mouseup="snackbarStyle = { opacity: 0.6 }"
          >
            {{ $tc('Cancel selection') }}
          </v-btn>
        </div>
      </div>
    </v-snackbar>
    <!-- Информационный Снэк-бар -->

    <!-- <editor-fold desc="Диалог процесса выполнения"> -->
    <v-dialog
      v-model="progressDialog.visible"
      overlay-opacity="0.3"
      width="300"
    >
      <v-card
        color="primary"
        dark
        tile
      >
        <v-card-text>
          <div style="height: 20px">
            {{ progressDialog.message }}
          </div>
          <v-progress-linear
            v-model="progressDialog.progress"
            :indeterminate="progressDialog.progress === 0"
            height="16"
            color="white"
            class="mb-0"
          >
            <strong
              v-if="progressDialog.progress > 0"
              class="black--text"
            >{{ Math.ceil(progressDialog.progress) }}%</strong>
          </v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- </editor-fold> -->
  </v-sheet>
</template>

<script lang="ts">

import AppTimeZoneAutocomplete from '@/components/AppTimeZoneAutocomplete/AppTimeZoneAutocomplete.vue'
import Vue from 'vue'
import ContactsList from './ContactsList.vue'
import AppStatusAutocomplete from '@/components/AppStatusAutocomplete/AppStatusAutocomplete.vue'
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue'
import AppSearchInput from '@/components/AppSearchInput/AppSearchInput.vue'
import AppBtnSorting from '@/components/AppBtnSorting/AppBtnSorting.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import { Contacts } from '@/api/Contacts'
import SContactDialogEditor from '@/snippets/SContactEditor/SContactDialogEditor.vue'
import { ContactInterface as SCEContactInterface } from '@/snippets/SContactEditor/interfaces'
import { mapGetters } from 'vuex'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import SSEMessage from '@/interfaces/SSEMessage'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'

interface Data {
  [keys: string]: any;
}

interface Methods {
  [keys: string]: any;
}

interface Computed {
  [keys: string]: any;
}

interface Props {
  [keys: string]: any;
}

export default Vue.extend<Data, Methods, Computed, Props>({

  components: {
    AppCountUp,
    AppTimeZoneAutocomplete,
    AppMenuTags: () => import(/* webpackChunkName: "contacts-menu-tags" */ '@/components/AppMenuTags/AppMenuTags.vue'),
    AppPagination,
    AppBtnSorting,
    AppSearchInput,
    AppMenuDatePicker,
    AppStatusAutocomplete,
    AppContactTagAutocomplete: () => import('@/components/AppContactTagAutocomplete/AppContactTagAutocomplete.vue'),
    AppUserGroupAutocomplete: () => import('@/components/AppUserGroupAutocomplete/AppUserGroupAutocomplete.vue'),
    AppUserAutocomplete: () => import('@/components/AppUserAutocomplete/AppUserAutocomplete.vue'),
    AppProjectAutocomplete: () => import('@/components/AppProjectAutocomplete/AppProjectAutocomplete.vue'),
    ContactsList
  },

  data () {
    return {
      snackbarStyle: { opacity: 0.6 },
      filterTasksItems: () => {
        return ['available', 'unavailable', 'overdue', 'not_overdue'].map((e) => {
          return {
            value: e,
            text: this.$t(`ContactsFilters.Tasks.${e}`)
          }
        })
      },
      filterCallingOptions: [
        { text: 'Yes', value: 'yes' },
        { text: 'No', value: 'no' }
      ],
      progressDialog: {
        visible: false,
        message: '',
        progress: 0
      },
      importExportProgress: {
        value: 0,
        visible: false
      },
      contactListMessageError: null
    }
  },

  computed: {
    ...mapGetters({
      contactsPerPage: 'contacts/per_page',
      contactsTotal: 'contacts/total',
      contactsItems: 'contacts/items',
      contactsSelected: 'contacts/selected',
      contactsSelectedCount: 'contacts/selected_count',
      contactsSelectedAll: 'contacts/selected_all',
      contactsParamsOrderBy: 'contacts/params/order_by',
      contactsParamsOrderDirection: 'contacts/params/order_direction',
      contactsProcessLoading: 'contacts/process_loading'
    }),

    // Vuex state
    contactsParamsFilterQ: {
      get () {
        return this.$store.getters['contacts/params/filter_q']
      },

      set (value?: string) {
        return this.$store.commit('contacts/params/filter_q', value)
      }
    },

    // Vuex state
    filterStatusIds: {
      get () {
        return this.$store.getters['contacts/params/filter_status_ids']
      },

      set (value: number[]) {
        this.$store.commit('contacts/params/filter_status_ids', value)
      }
    },

    // Vuex state
    contactsParamsFilterProjectId: {
      get () {
        return this.$store.getters['contacts/params/filter_project_id']
      },

      set (value?: number) {
        this.filterStatusIds = []
        this.$store.commit('contacts/params/filter_project_id', value)
      }
    },

    // Vuex state
    filterUserId: {
      get () {
        return this.$store.getters['contacts/params/filter_user_id']
      },

      set (value: number) {
        this.$store.commit('contacts/params/filter_user_id', value)
      }
    },

    // Vuex state
    filterUserGroupId: {
      get () {
        return this.$store.getters['contacts/params/filter_user_group_id']
      },

      set (value: number) {
        this.$store.commit('contacts/params/filter_user_group_id', value)
      }
    },

    // Vuex state
    filterTagIds: {
      get () {
        return this.$store.getters['contacts/params/filter_tag_ids']
      },

      set (value: number[]) {
        this.$store.commit('contacts/params/filter_tag_ids', value)
      }
    },

    // Vuex state
    filterContactCreatedAt: {
      get () {
        return this.$store.getters['contacts/params/filter_contact_created_at']
      },

      set (value: string) {
        this.$store.commit('contacts/params/filter_contact_created_at', value)
      }
    },

    // Vuex state
    filterTask: {
      get () {
        return this.$store.getters['contacts/params/filter_task']
      },

      set (value?: number) {
        return this.$store.commit('contacts/params/filter_task', value)
      }
    },

    // Vuex state
    filterCalling: {
      get () {
        return this.$store.getters['contacts/params/filter_calling']
      },

      set (value: string) {
        this.$store.commit('contacts/params/filter_calling', value)
      }
    },

    filterTimeZone: {
      get () {
        return this.$store.getters['contacts/params/filter_timezone']
      },

      set (value?: string) {
        return this.$store.commit('contacts/params/filter_timezone', value)
      }
    },

    offset: {
      get () {
        return this.$store.getters['contacts/params/filter_offset']
      },

      set (value: number) {
        this.$store.commit('contacts/params/filter_offset', value)
      }
    },

    sortOption: {
      get () {
        return {
          order_by: this.$store.getters['contacts/params/order_by'],
          order_direction: this.$store.getters['contacts/params/order_direction']
        }
      },

      set (val?: { order_by: string, order_direction: string }) {
        this.$store.commit('contacts/params/order_by', val?.order_by || '')
        this.$store.commit('contacts/params/order_direction', val?.order_direction || '')
      }
    },

    /**
     * Параметры активных фильтров
     */
    paramsForQuery () {
      const params: Record<string, string | number> = {}

      if (this.contactsParamsFilterQ) {
        params.q = this.contactsParamsFilterQ
      }

      if (this.filterStatusIds.length > 0) {
        params.status_ids = this.filterStatusIds.join(',')
      }

      if (this.contactsParamsFilterProjectId) {
        params.project_id = this.contactsParamsFilterProjectId
      }

      if (this.filterUserId) {
        params.owner_id = this.filterUserId
      }

      if (this.filterUserGroupId) {
        params.user_group_id = this.filterUserGroupId
      }

      if (this.filterTagIds.length > 0) {
        params.tag_ids = this.filterTagIds.join(',')
      }

      if (this.filterTimeZone) {
        params.timezone = this.filterTimeZone
      }

      // Сортировка
      if (this.contactsParamsOrderBy && this.contactsParamsOrderDirection) {
        params.order_by = this.contactsParamsOrderBy
        params.order_direction = this.contactsParamsOrderDirection
      }

      // Дата и время создания контакта (возможен диапазон разделённый запятой)
      if (Array.isArray(this.filterContactCreatedAt)) {
        let contactCreatedAtStart = this.$dayjs(this.filterContactCreatedAt[0], 'YYYY-MM-DD')
        let contactCreatedAtEnd = this.$dayjs(this.filterContactCreatedAt[1], 'YYYY-MM-DD')

        contactCreatedAtStart = contactCreatedAtStart.set('hour', 0).set('minute', 0).set('second', 0)
        contactCreatedAtEnd = contactCreatedAtEnd.set('hour', 23).set('minute', 59).set('second', 59)

        params.contact_created_at = `${contactCreatedAtStart.unix()},${contactCreatedAtEnd.unix()}`
      } else if (this.filterContactCreatedAt) {
        let contactCreatedAtStart = this.$dayjs(this.filterContactCreatedAt, 'YYYY-MM-DD')
        let contactCreatedAtEnd = this.$dayjs(this.filterContactCreatedAt, 'YYYY-MM-DD')

        contactCreatedAtStart = contactCreatedAtStart.set('hour', 0).set('minute', 0).set('second', 0)
        contactCreatedAtEnd = contactCreatedAtEnd.set('hour', 23).set('minute', 59).set('second', 59)

        params.contact_created_at = `${contactCreatedAtStart.unix()},${contactCreatedAtEnd.unix()}`
      } else if (this.filterContactCreatedAt) {
        const contactCreatedAtStart = this.$dayjs(this.filterContactCreatedAt, 'YYYY-MM-DD')
        const contactCreatedAtEnd = this.$dayjs(this.filterContactCreatedAt, 'YYYY-MM-DD')

        contactCreatedAtStart.set('hour', 0).set('minute', 0).set('second', 0)
        contactCreatedAtEnd.set('hour', 23).set('minute', 59).set('second', 59)

        params.contact_created_at = `${contactCreatedAtStart.unix()},${contactCreatedAtEnd.unix()}`
      }

      // ----
      if (this.filterCalling) {
        params.calling = this.filterCalling
      }

      if (this.offset > 0) {
        params.offset = this.offset
      }
      if (this.filterTask) {
        params.task = this.filterTask
      }

      return params
    },

    sortingOptions () {
      return [
        {
          name: 'По имени',
          order_by: 'contact_name',
          order_direction: 'asc',
          visible: true
        },
        {
          name: 'По проекту',
          order_by: 'project',
          order_direction: 'asc',
          visible: true
        },
        {
          name: 'По дате создания',
          order_by: 'created_at',
          order_direction: 'asc',
          visible: true
        },
        {
          name: 'По дате последнего звонка',
          order_by: 'last_call_at',
          order_direction: 'asc',
          visible: true
        }
      ]
    },

    appStatusAutocompleteParams () {
      const params: Record<string, number | unknown> = {}

      if (this.$isGranted(['ROLE_ADMIN', 'ROLE_RCC']) && Number(this.contactsParamsFilterProjectId) > 0) {
        params.project_id = this.contactsParamsFilterProjectId
      }

      return params
    }
  },

  watch: {
    // Следим за каждым изменением всех параметров фильтров.
    paramsForQuery (val: unknown) {
      this.fetchContacts(val)
    }
  },

  mounted () {
    if (this.contactsItems.length === 0) {
      this.fetchContacts(this.paramsForQuery)
    }

    this.$root.$on('sse-contacts-import-process', this.onSSEContactsImportProcess)
    this.$root.$on('sse-contacts-export-process', this.onSSEContactsExportProcess)
    this.$root.$on('sse-contacts-transfer-process', this.onSSEContactsTransferProcess)
  },

  beforeDestroy () {
    this.$root.$off('sse-contacts-import-process', this.onSSEContactsImportProcess)
    this.$root.$off('sse-contacts-export-process', this.onSSEContactsExportProcess)
    this.$root.$off('sse-contacts-transfer-process', this.onSSEContactsTransferProcess)
  },

  methods: {
    /**
     * Загружает контакты с сервера.
     */
    fetchContacts (params: Record<string, string | number> = {}) {
      this.contactListMessageError = ''
      this.$store
        .dispatch('contacts/items', params)
        .catch((e: Error) => {
          this.$store.commit('contacts/total', 0)
          this.$store.commit('contacts/items', [])
          this.contactListMessageError = e.message
        })
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
                this.fetchContacts(this.paramsForQuery)
              }).finally(() => (instance.close()))
          }
        },
        title: 'Создание контакта',
        waitForResult: false,
        width: '60%'
      })
    },

    onBtnRefreshClick () {
      this.fetchContacts(this.paramsForQuery)
    },

    onBtnDeleteClick () {
      // Delete
    },

    /**
     * Событие происходит когда нажали на кнопку "передать контакты".
     * Диалог передачи контактов.
     */
    async onBtnTransferContactsClick () {
      import(
        /* webpackChunkName: "contacts-transfer-dialog" */
        '@/components/AppContactTransferDialog/AppContactTransferDialog.vue')
        .then(async (component) => {
          const instance = await this.$dialog.show(component.default, {
            waitForResult: false
          })
          // Сработает когда нажали кнопку отменить передачу контактов.
          instance.vmd.$on('cancel', () => (instance.close()))

            interface Cs {
              project_id: number;
              user_ids: number[];
            }

            // Сработает когда нажали кнопку подтверждения передачи.
            instance.vmd.$on('confirm',
              (data: Cs) => {
                instance.close()

                const params: Record<string, any> = Object.assign({}, this.paramsForQuery)

                if ('count' in params) {
                  delete params.count
                }

                if ('offset' in params) {
                  delete params.offset
                }

                if ('order_direction' in params) {
                  delete params.order_direction
                }

                if ('order_by' in params) {
                  delete params.order_by
                }

                new Contacts()
                  .transfer({
                    project_id: data.project_id, // Проект в который передаём.
                    user_ids: data.user_ids, // Идентификаторы пользователей, кому передаём.
                    params // параметры для извлечения списка контактов
                  }).finally(() => {
                    this.$store.dispatch('contacts/unselect')
                  })
              })
        })
    },

    onBtSortingChange () {
      // this.fetchContacts(this.paramsForQuery)
    },

    /**
     * Событие происходит когда пользователь устанавливает параметры фильтров.
     */
    onFilterChange () {
      this.offset = 0
    },

    /**
     * Событие происходит когда нажали на кнопку "выбрать всё".
     */
    onBtnSelectAllClick () {
      this.$store.dispatch('contacts/selected_all')
    },

    onBtnCancelSelectionClick () {
      this.$store.dispatch('contacts/unselect')
    },

    onContactListItemStatusClick (status_id: number) {
      const items = this.filterStatusIds.map((e: number) => e)
      if (!items.includes(status_id)) {
        items.push(status_id)
        this.filterStatusIds = items
      }
    },

    /**
     * Назначение тегов.
     *
     * @param tagIds идентификаторы тегов.
     */
    onAppMenuTagsApply (tagIds: number[]) {
      new Contacts()
        .setTags({
          contact_ids: this.contactsSelected,
          tag_ids: tagIds
        }).then(() => {
          this.$store.dispatch('contacts/unselect')
        })
    },

    /**
     * При клике на кнопку "Экспортировать"
     **/
    onExportClick (format: 'xlsx' | 'csv') {
      const params: Record<string, any> = Object.assign({ format }, this.paramsForQuery)

      if ('count' in params) {
        delete params.count
      }

      if ('offset' in params) {
        delete params.offset
      }

      this.progressDialog.progress = 0
      this.progressDialog.message = this.$tc('Please stand by...')
      this.progressDialog.visible = true

      if (this.contactsSelectedAll) {
        new Contacts()
          .export(params)
          .then(() => {
            this.$toast.success('Идет формирование файла, ожидайте ...')
          })
      } else {
        new Contacts()
          .export(params)
          .then(() => {
            this.$toast.success('Идет формирование файла, ожидайте ...')
          })
      }
    },

    /**
     * При клике на кнопку "Импортировать"
     */
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
      }

      this.$fileDialog
        .open({
          accept,
          multiple: false
        }).then((file) => {
          if (file instanceof File) {
            const formData = new FormData()
            formData.append('file', new Blob([file], { type: file.type }))

            this.progressDialog.message = this.$tc('Uploading a file to the server...')
            $axios.post('/contacts/import', formData, {
              onUploadProgress: (progressEvent: any) => {
                this.progressDialog.progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
              }
            }).then((response: AxiosResponse) => {
              if (response.status === 202) {
                this.progressDialog.progress = 0
                this.progressDialog.message = this.$tc('Please stand by...')
                this.progressDialog.visible = true
              }
            }).catch((e: Error) => {
              this.$toast.error(e.message)
            })
          }
        })
    },

    /**
     * Событие процесса экспорта контактов.
     * @param message
     */
    onSSEContactsImportProcess (message: SSEMessage) {
      if (message.payload.status === 'progress') {
        // Процесс импортирования файла.
        this.progressDialog.progress = +message.payload.percent
        this.progressDialog.message = this.$tc('Please stand by...')
        this.progressDialog.visible = true
      } else if (message.payload.status === 'success') {
        // Процесс импортирования файла завершён успешно.
        this.progressDialog.visible = false
        this.progressDialog.message = ''
        this.fetchContacts(this.paramsForQuery)
      } else if (message.payload.status === 'failure') {
        // В процессе импортирования произошла ошибка.
        this.$toast.error(message.payload.message)
      }
    },

    /**
     * Событие процесса экспорта контактов.
     * @param message
     */
    onSSEContactsExportProcess (message: SSEMessage) {
      if (message.payload.status === 'progress') {
        // Процесс формирования файла.
        this.progressDialog.progress = +message.payload.percent
        this.progressDialog.message = this.$tc('Please stand by...')
        this.progressDialog.visible = true
      } else if (message.payload.status === 'writing') {
        // Процесс подготовки файла
        this.progressDialog.progress = 0
        this.progressDialog.message = this.$tc('File preparation...')
        this.progressDialog.visible = true
      } else if (message.payload.status === 'success') {
        this.progressDialog.message = this.$tc('Downloading file...')

        // Скачивание файла
        this.$axios.get(message.payload.url, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent: any) => {
            this.progressDialog.progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          }
        })
          .then((response: AxiosResponse) => {
            const type = response.headers['content-type']

            const a = document.createElement('a')
            a.setAttribute('style', 'display: none')

            const fileName = message.payload.url.split('/').pop()
            a.setAttribute('download', fileName)
            document.body.appendChild(a)
            const url = window.URL.createObjectURL(new Blob([response.data], { type }))
            a.href = url
            a.click()
            setTimeout(() => {
              a.remove()
            }, 1000)

            window.URL.revokeObjectURL(url)
          }).finally(() => {
            this.progressDialog.visible = false
            this.progressDialog.message = ''
          })
      } else if (message.payload.status === 'failure') {
        this.$toast.error('An error occurred during the export operation.')
      }
    },

    /**
     * Событие процесса передачи контактов.
     * @param message
     */
    onSSEContactsTransferProcess (message: SSEMessage) {
      if (message.payload.status === 'progress') {
        this.progressDialog.progress = +message.payload.percent
        this.progressDialog.message = this.$tc('Please stand by...')
        this.progressDialog.visible = true
      } else if (message.payload.status === 'success') {
        this.progressDialog.visible = false
        this.progressDialog.message = ''
        this.progressDialog.progress = 0

        this.fetchContacts(this.paramsForQuery)
      }
    }
  }
})

</script>

<style lang="scss" scoped>

</style>

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
          <span
            style="font-size: 14px"
          >
            Выбрано элементов ({{ contactsSelected.length }})
          </span>
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
            @click="$store.commit('contacts/selected', [])"
            @mouseup="snackbarStyle = { opacity: 0.6 }"
          >
            {{ $tc('Cancel selection') }}
          </v-btn>
        </div>
      </div>
    </v-snackbar>
    <!-- Информационный Снэк-бар -->
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
import Contact from '@/api/interfaces/Contact'
import { ContactExportParamsInterface, Contacts } from '@/api/Contacts'
import SContactDialogEditor from '@/snippets/SContactEditor/SContactDialogEditor.vue'
import { ContactInterface as SCEContactInterface } from '@/snippets/SContactEditor/interfaces'
import { mapGetters } from 'vuex'

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
          order_by: 'by_name',
          order_direction: 'asc',
          visible: true
        },
        {
          name: 'По проекту',
          order_by: 'by_project',
          order_direction: 'asc',
          visible: true
        },
        {
          name: 'По дате создания',
          order_by: 'by_created_at',
          order_direction: 'asc',
          visible: true
        },
        {
          name: 'По дате последнего звонка',
          order_by: 'by_last_call_at',
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

    this.$root.$on('sse-contacts-transferred', this.onSSEContactsTransferred)
  },

  beforeDestroy () {
    this.$root.$off('sse-contacts-transferred', this.onSSEContactsTransferred)
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

          // Сработает когда нажали кнопку подтверждения передачи.
          instance.vmd.$on('confirm',
            ({
              project_id,
              contact_ids,
              user_ids,
              new_date
            }) => {
              instance.close()
              this.$store.commit('contacts/selected', [])
              new Contacts()
                .transfer({
                  project_id,
                  contact_ids,
                  user_ids
                }).then(() => {
                  this.$toast.success('The operation is queued for execution.')
                })
            })
        })
    },

    onBtSortingChange () {
      this.fetchContacts(this.paramsForQuery)
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
      // Копирую ранее выбранные идентификаторы
      const contactIds: number[] = this.contactsSelected.map((id: number) => id)
      this.contactsItems.forEach((e: Contact) => {
        // Добавляю в список если не существует
        if (!contactIds.includes(e.id)) {
          contactIds.push(e.id)
        }
      })
      // Фиксирую состояние
      this.$store.commit('contacts/selected', contactIds)
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
     * Обработчик события "sse-contacts-transferred" корневой шины.
     * Обработчик сработает при двух условиях.
     *
     * 1 - Пользователь находится на текущей странице.
     * 2 - Пользователь получил SSE сообщение.
     */
    onSSEContactsTransferred () {
      // Обновит список контактов с текущей конфигурацией фильтров.
      this.fetchContacts(this.paramsForQuery)
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
        filters: this.paramsForQuery,
        format,
        target_contacts: this.contactsSelected < 0 ? [] : this.contactsSelected.map((e: number) => e)
      }

      new Contacts()
        .export(params)
        .then(() => {
          this.$toast.success('Идет формирование файла, ожидайте ...')
        })
        .finally()
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
          new Contacts()
            .import(file)
            .then(() => {
              this.$toast.success('Импортирование контактов, ожидайте ...')
            }).catch((error: Error) => {
              this.$toast.error(error.message)
            })
        }
      })
    }
  }
})

</script>

<style lang="scss" scoped>

</style>

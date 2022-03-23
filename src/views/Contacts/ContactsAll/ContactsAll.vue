<template>
  <div class="contacts-all">
    <div
      class="mb-2"
      style="height: 28px"
    >
      <contacts-list-tools
        @btn:click:add-to-autodialer="onToolsBtnAddToAutodialer"
      />
    </div>

    <app-divider
      :loading="contactsLoading && contacts.length"
    />

    <!-- Контакт лист -->
    <div class="main-content">
      <div class="main-content__filter">
        <contacts-list-filters />
      </div>
      <div class="main-content__table">
        <v-data-table
          v-model="contactsSelected"
          item-key="id"
          selectable-key="id"
          height="calc(100vh - 150px)"
          :item-class="() => 'contacts-item'"
          :headers="contactsHeaders"
          :items="contacts"
          :server-items-length="contactsTotal"
          :items-per-page="100"
          :loading="contactsLoading"
          :show-select="$isGranted(['ROLE_ADMIN', 'ROLE_CCM'])"
          calculate-widths
          fixed-header
          hide-default-footer
          dense
        >
          <template #progress>
            {{ '' }}
          </template>
          <template #no-data>
            <div
              class="d-flex align-center justify-center grey--text"
              style="height: calc(100vh - 200px)"
            >
              <template v-if="contactsError">
                <div class="d-flex flex-column">
                  <div class="mb-2">
                    {{ $tc(contactsErrorText) }}
                  </div>
                  <v-btn
                    small
                    text
                    tile
                    @click="onBtnToRetryClick"
                  >
                    {{ $tc('To retry') }}
                  </v-btn>
                </div>
              </template>
              <span v-else>
                {{ $tc('No data') }}
              </span>
            </div>
          </template>
          <template #loading>
            <div
              class="d-flex align-center justify-center grey--text"
              style="height: calc(100vh - 200px)"
            >
              <app-loading />
            </div>
          </template>
          <template #[`item.full_name`]="{ item }">
            <router-link
              v-if="item.is_new"
              style="color: #20ab26"
              :to="{ name: 'contacts_view', params: { id: item.id } }"
            >
              {{ item.full_name }}
            </router-link>
            <router-link
              v-else
              style="color: #5f6060"
              :to="{ name: 'contacts_view', params: { id: item.id } }"
            >
              {{ item.full_name }}
            </router-link>
          </template>
          <template #[`item.status`]="{ item }">
            <template v-if="typeof item.status === 'object'">
              <v-chip
                :color="item.status.color"
                label
                x-small
                outlined
              >
                {{ item.status.name }}
              </v-chip>
            </template>
            <template v-else>
              —
            </template>
          </template>
        </v-data-table>
      </div>
    </div>
    <!-- Контакт лист -->

    <app-info-line
      v-if="contactsSelectedLength > 0"
      :top="50"
      :height="45"
      :width="400"
      z-index="2"
      background-color="#3a70d4"
    >
      <div class="d-flex align-center justify-space-between fill-height ">
        <span class="white--text">{{ $tc('selected_elements', contactsSelectedLength) }}</span>
        <v-btn
          class="white--text"
          style="font-size: 12px"
          small
          tile
          text
          @click="contactsSelected = []"
        >
          {{ $tc('Cancel') }}
        </v-btn>
      </div>
    </app-info-line>
  </div>
</template>

<script lang="ts">
import Contact from '@/api/interfaces/Contact'
import AppBase from '@/AppBase'
import AppBlockResize from '@/components/AppBlockResize/AppBlockResize.vue'
import AppInfoLine from '@/components/AppInfoLine/AppInfoLine.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppTable from '@/components/AppTable/AppTable.vue'
import debounce from '@/utils/debounce'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

// eslint-disable-next-line no-use-before-define
@Component<ContactsAll>({
  components: {
    AppBlockResize,
    AppInfoLine,
    AppLoading,
    AppTable,
    ContactsListTransferDialog: () => import(
      /* webpackChunkName: "contacts-all-transfer-dialog" */
      './ContactsAllTransferDialog.vue'
      ),
    ContactsListFilters: () => import(
      /* webpackChunkName: "contacts-all-filter" */
      './ContactsAllFilters.vue'
      ),
    ContactsListTools: () => import(
      /* webpackChunkName: "contacts-all-tools" */
      './ContactsAllTools.vue'
      ),
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if ((vm.$store.getters['contacts/contacts_all/items'] as Array<Contact>).length === 0) {
        vm.$store.dispatch('contacts/contacts_all/fetch')
      }
    })
  }
})
export default class ContactsAll extends AppBase {
  get settingsFilterWidth (): number { return this.$store.getters['contacts/contacts_all/settings/filter_width'] }
  set settingsFilterWidth (val: number) { this.$store.commit('contacts/contacts_all/settings/filter_width', val) }

  get contactsHeaders () {
    return [
      {
        text: 'Контакт',
        align: 'start',
        sortable: false,
        value: 'full_name'
      },
      {
        text: 'Статус',
        align: 'center',
        sortable: false,
        value: 'status'
      },
      {
        text: 'Ответственный',
        align: 'start',
        sortable: false,
        value: 'owner'
      },
      {
        text: 'Проект',
        align: 'start',
        sortable: false,
        value: 'project'
      },
      {
        text: 'Дата последнего вызова',
        align: 'center',
        sortable: false,
        value: 'last_call_at'
      }
    ]
  }

  get contacts () {
    return (this.$store.getters['contacts/contacts_all/items'] || [])
      .map((e) => {
        return {
          id: e.id,
          full_name: e.full_name,
          status: e?.status || '—',
          owner: e?.owner?.full_name || '—',
          project: e?.project?.name || '—',
          last_call_at: e?.last_call_at ? this.$dayjs(e?.last_call_at).format('DD.MM.YYYY HH:mm') : '',
          is_new: !!e?.is_new
        }
      })
  }

  get contactsTotal (): number { return this.$store.getters['contacts/contacts_all/items_total'] }

  get contactsSelectedLength (): number { return (this.$store.getters['contacts/contacts_all/items_selected'] || []).length }
  get contactsSelected () { return (this.$store.getters['contacts/contacts_all/items_selected'] || []) }
  set contactsSelected (val) { this.$store.commit('contacts/contacts_all/items_selected', val) }

  get contactsError (): boolean { return this.$store.getters['contacts/contacts_all/error'] }
  get contactsErrorText (): string { return this.$store.getters['contacts/contacts_all/error_text'] }
  get contactsLoading (): boolean { return this.$store.getters['contacts/contacts_all/loading'] }

  // Все параметры фильтров
  get filterAll () {
    return this.$store.getters['contacts/contacts_all/filter/all']
  }

  // Здесь отслеживаем все параметры фильтров в одном месте.
  @Watch('filterAll')
  filterAllWatch () {
    this.onFilterChange()
  }

  created () {
    this.onFilterChange = debounce(this.onFilterChange, 350)

    this.$root.$on('sse:contacts:transferred', this.onSSEContactsTransferred)
  }

  beforeDestroy () {
    this.$root.$off('sse:contacts:transferred', this.onSSEContactsTransferred)
  }

  /**
   * Срабатывает при изменении состояния фильтров
   * @private
   */
  private onFilterChange () {
    this.$store.dispatch('contacts/contacts_all/fetch')
  }

  private onBtnToRetryClick () {
    this.$store.dispatch('contacts/contacts_all/fetch')
  }

  private onToolsBtnAddToAutodialer () {
    this.$store.dispatch('contacts/contacts_all/add_to_autodialer', 3)
  }

  private onSSEContactsTransferred () {
    this.$store.dispatch('contacts/contacts_all/unselect_all')
    this.$store.dispatch('contacts/contacts_all/fetch')
  }
}

</script>

<style lang="scss">


.contacts-all {
  height: 100%;
}

.main-content {
  display: flex;
  flex-direction: row;
}

.main-content__filter {
  height: calc(100vh - 149px);
  min-width: 250px;
  max-width: 250px;
  overflow-y: auto;
  margin-right: 10px;
}

.main-content__table {
  height: calc(100vh - 149px);
  flex-grow: 1;
  overflow: auto;
}

.contacts-item td {
  white-space: nowrap !important;
}

.contacts-item td {
  height: 25px !important;
}

.contacts-item td:nth-child(2) {
  width: 100%;
}
</style>

<i18n>
{
  "ru": {
    "delete_confirmation_1": "<b>Удалить {n} контакт?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation_2": "<b>Удалить {n} контакта?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation_3": "<b>Удалить {n} контактов?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation": "NaN | @:delete_confirmation_1 | @:delete_confirmation_2 | @:delete_confirmation_3",
    "selected_elements": " | Выбран {n} контакт |  Выбрано {n} контакта | Выбрано {n} контактов"
  }
}
</i18n>

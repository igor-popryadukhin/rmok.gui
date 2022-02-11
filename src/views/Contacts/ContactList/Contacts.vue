<template>
  <div>
    <contacts-tools
      class="mb-2"
      @btn:click:add-to-autodialer="onToolsBtnAddToAutodialer"
    />

    <app-divider
      :loading="contactsLoading && contacts.length"
    />

    <!-- Контакт лист -->
    <v-data-table
      v-model="contactsSelected"
      item-key="id"
      selectable-key="id"
      height="calc(100vh - 120px)"
      :item-class="() => 'contacts-item'"
      :headers="contactsHeaders"
      :items="contacts"
      :server-items-length="contactsTotal"
      :items-per-page="100"
      :loading="contactsLoading"
      calculate-widths
      fixed-header
      hide-default-footer
      show-select
      dense
    >
      <template #progress>
        {{ '' }}
      </template>
      <template #no-data>
        <div
          class="d-flex align-center justify-center grey--text"
          style="height: calc(100vh - 550px)"
        >
          Отсутствуют данные
        </div>
      </template>
      <template #loading>
        <div
          class="d-flex align-center justify-center grey--text"
          style="height: calc(100vh - 160px)"
        >
          <app-loading />
        </div>
      </template>
      <template #[`item.full_name`]="{ item }">
        <router-link :to="{ name: 'contacts_view', params: { id: item.id } }">
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
    <!-- Контакт лист -->
    <app-divider />

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

    <app-navigation-drawer v-model="filterPanelVisible">
      <contact-list-filters />
    </app-navigation-drawer>
  </div>
</template>

<script lang="ts">
import Contact from '@/api/interfaces/Contact'
import AppBase from '@/AppBase'
import AppInfoLine from '@/components/AppInfoLine/AppInfoLine.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppTable from '@/components/AppTable/AppTable.vue'
import debounce from '@/utils/debounce'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import ContactsTools from './ContactsTools.vue'

// eslint-disable-next-line no-use-before-define
@Component<Contacts>({
  components: {
    AppInfoLine,
    AppLoading,
    ContactsTransferDialog: () => import('./ContactsTransferDialog.vue'),
    AppNavigationDrawer: () => import('@/components/AppNavigationDrawer/AppNavigationDrawer.vue'),
    ContactListFilters: () => import('./ContactListFilters.vue'),
    AppTable,
    ContactsTools
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if ((vm.$store.getters['contacts/list/items'] as Array<Contact>).length === 0) {
        vm.$store.dispatch('contacts/list/fetch')
      }
    })
  }
})
export default class Contacts extends AppBase {
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
    return (this.$store.getters['contacts/list/items'] || [])
      .map((e) => {
        return {
          id: e.id,
          full_name: e.full_name,
          status: e?.status || '—',
          owner: e?.owner?.full_name || '—',
          project: e?.project?.name || '—',
          last_call_at: e?.last_call_at ? this.$dayjs(e?.last_call_at).format('DD.MM.YYYY HH:mm') : ''
        }
      })
  }

  get contactsTotal (): number { return this.$store.getters['contacts/list/items_total'] }

  get contactsSelectedLength (): number { return (this.$store.getters['contacts/list/items_selected'] || []).length }
  get contactsSelected () { return (this.$store.getters['contacts/list/items_selected'] || []) }
  set contactsSelected (val) { this.$store.commit('contacts/list/items_selected', val) }

  get contactsLoading (): boolean { return this.$store.getters['contacts/list/loading'] }

  // Все параметры фильтров
  get filterAll () {
    return this.$store.getters['contacts/list/filter/all']
  }

  get contactsTransferDialogVisible () {
    return this.$store.getters['contacts/transfer_dialog/visible']
  }

  get filterPanelVisible (): boolean {
    return this.$store.getters['contacts/list/filter/filter_panel_visible']
  }

  set filterPanelVisible (val: boolean) {
    this.$store.commit('contacts/list/filter/filter_panel_visible', val)
  }

  // Здесь отслеживаем все параметры фильтров в одном месте.
  @Watch('filterAll')
  filterAllWatch () {
    this.onFilterChange()
  }

  created () {
    this.onFilterChange = debounce(this.onFilterChange, 350)

    this.$root.$on('sse-contacts-transferred', this.onSSEContactsTransferred)
  }

  beforeDestroy () {
    this.$root.$off('sse-contacts-transferred', this.onSSEContactsTransferred)
  }

  /**
   * Срабатывает при изменении состояния фильтров
   * @private
   */
  private onFilterChange () {
    this.$store.dispatch('contacts/list/fetch')
  }

  private onToolsBtnAddToAutodialer () {
    this.$store.dispatch('contacts/list/add_to_autodialer', 3)
  }

  private onSSEContactsTransferred () {
    this.$store.dispatch('contacts/list/unselect_all')
    this.$store.dispatch('contacts/list/fetch')
  }
}

</script>

<style lang="scss">
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

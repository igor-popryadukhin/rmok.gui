<template>
  <div>
    <contacts-works-tools
      class="mb-2"
      @btn:click:add-to-autodialer="onToolsBtnAddToAutodialer"
    />

    <app-divider
      :loading="contactsLoading && contacts.length"
    />

    <!-- Контакт лист -->
    <div class="d-flex flex-nowrap">
      <app-block-resize :width.sync="settingsFilterWidth">
        <contact-list-filters />
      </app-block-resize>
      <div class="grow pl-2">
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
      </div>
    </div>
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
import ContactsInWorkTools from './ContactsInWorkTools.vue'

// eslint-disable-next-line no-use-before-define
@Component<ContactsInWork>({
  components: {
    AppBlockResize,
    AppInfoLine,
    AppLoading,
    ContactsListFilters: () => import('./ContactsInWorkFilters.vue'),
    AppTable,
    ContactsInWorkTools
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if ((vm.$store.getters['contacts/list_in_works/items'] as Array<Contact>).length === 0) {
         vm.$store.dispatch('contacts/list_in_works/fetch')
      }
    })
  }
})
export default class ContactsInWork extends AppBase {
  get settingsFilterWidth (): number { return this.$store.getters['contacts/list_in_works/settings/filter_width'] }
  set settingsFilterWidth (val: number) { this.$store.commit('contacts/list_in_works/settings/filter_width', val) }

  get contactsHeaders () {
    return [
      {
        text: 'Контакт',
        align: 'start',
        sortable: false,
        value: 'full_name'
      },
      {
        text: 'Последнее сообщение',
        align: 'center',
        sortable: false,
        value: 'last_message'
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
        text: 'Дата последнего контакта',
        align: 'center',
        sortable: false,
        value: 'last_call_at'
      },
      {
        text: 'Канал контакта',
        align: 'center',
        sortable: false,
        value: 'channel'
      }
    ]
  }

  get contacts () {
    return (this.$store.getters['contacts/list_in_works/items'] || [])
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

  get contactsTotal (): number { return this.$store.getters['contacts/list_in_works/items_total'] }

  get contactsSelectedLength (): number { return (this.$store.getters['contacts/list_in_works/items_selected'] || []).length }
  get contactsSelected () { return (this.$store.getters['contacts/list_in_works/items_selected'] || []) }
  set contactsSelected (val) { this.$store.commit('contacts/list_in_works/items_selected', val) }

  get contactsLoading (): boolean { return this.$store.getters['contacts/list_in_works/loading'] }

  // Все параметры фильтров
  get filterAll () {
    return this.$store.getters['contacts/list_in_works/filter/all']
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
    this.$store.dispatch('contacts/list_in_works/fetch')
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

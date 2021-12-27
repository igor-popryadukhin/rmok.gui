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
        <contact-list-tools
          class="mb-2"
          @btn:click:add-to-autodialer="onToolsBtnAddToAutodialer"
        />
        <v-divider />
        <!-- Контакт лист -->
        <contact-list
          :loading="contactLoading"
          :height="heightContactList"
          overlay
        />
        <!-- Контакт лист -->
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
          :height="heightContactListFilters"
          class="pr-2"
          style="overflow-y: auto;"
        >
          <contact-list-filters />
        </v-sheet>
      </v-col>
      <!-- Фильтры -->
    </v-row>

    <contact-create />

    <contacts-transfer-dialog
      v-if="contactsTransferDialogVisible"
      @close="contactTransferDialogVisible = false"
    />

    <app-progress-dialog
      v-if="progressDialog.visible"
      :progress="progressDialog.progress"
      :message="progressDialog.message"
    />
  </v-sheet>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Base from './Base'
import ContactListFilters from './ContactListFilters.vue'
import ContactListTools from './ContactListTools.vue'
import AppTable from '@/components/AppTable/AppTable.vue'
import ContactList from './ContactList.vue'
import Contact from '@/api/interfaces/Contact'
import debounce from '@/utils/debounce'
import { Watch } from 'vue-property-decorator'
import SSEMessage from '@/interfaces/SSEMessage'
import AppProgressDialog from '@/components/AppProgressDialog/AppProgressDialog.vue'

// eslint-disable-next-line no-use-before-define
@Component<Index>({
  components: {
    AppProgressDialog,
    ContactCreate: () => import('@/views/Contacts/ContactList/ContactCreate.vue'),
    ContactsTransferDialog: () => import('./ContactsTransferDialog.vue'),
    ContactList,
    AppTable,
    ContactListTools,
    ContactListFilters
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if ((vm.$store.getters['contacts/list/items'] as Array<Contact>).length === 0) {
        vm.$store.dispatch('contacts/list/fetch')
      }
    })
  }
})
export default class Index extends Base {
  progressDialog = {
    visible: false,
    message: '',
    progress: 0
  }

  contactTransferDialogVisible = false

  // Вычисляемая высота списка контактов
  get heightContactList () {
    return this.screenHeight - 125
  }

  // Вычисляемая высота области фильтров
  get heightContactListFilters () {
    return this.screenHeight - 90
  }

  // Все параметры фильтров
  get filterAll () {
    return this.$store.getters['contacts/list/filter/all']
  }

  get contactsTransferDialogVisible () {
    return this.$store.getters['contacts/transfer_dialog/visible']
  }

  // Здесь отслеживаем все параметры фильтров в одном месте.
  @Watch('filterAll')
  filterAllWatch () {
    this.onFilterChange()
  }

  created () {
    this.onFilterChange = debounce(this.onFilterChange, 350)

    this.$root.$on('sse-contacts-add-to-autodialer', this.onSSEContactsAddToAutodialer)
    this.$root.$on('sse-contacts-transferred', this.onSSEContactsTransferred)
  }

  beforeDestroy () {
    this.$root.$off('sse-contacts-add-to-autodialer', this.onSSEContactsAddToAutodialer)
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

  private onSSEContactsAddToAutodialer (message: SSEMessage) {
    if (message.payload.status === 'progress') {
      this.progressDialog.progress = +message.payload.percent
      this.progressDialog.message = this.$tc('Please stand by...')
      this.progressDialog.visible = true
    } else if (message.payload.status === 'success') {
      this.progressDialog.visible = false
      this.progressDialog.message = ''
      this.progressDialog.progress = 0

      this.$store.dispatch('contacts/list/unselect_all')
    } else if (message.payload.status === 'failure') {
      this.$toast.error(message.payload.message)
    }
  }

  private onSSEContactsTransferred () {
    this.$store.dispatch('contacts/list/unselect_all')
    this.$store.dispatch('contacts/list/fetch')
  }
}

</script>

<style lang="scss" scoped>

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

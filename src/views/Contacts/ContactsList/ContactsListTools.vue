<template>
  <div class="d-flex">
    <v-btn
      v-if="!contactsIsSelected"
      small
      tile
      text
      @click="onBtnAddClick"
    >
      {{ $tc('Add') }}
    </v-btn>

    <v-btn
      v-if="contactsLoading"
      color="red"
      style="min-width: 100px"
      small
      tile
      text
      @click="onBtnCancelClick"
    >
      {{ $tc('Cancel') }}
    </v-btn>
    <v-btn
      v-else-if="!contactsIsSelected"
      style="min-width: 100px"
      small
      tile
      text
      @click="onBtnRefreshClick"
    >
      {{ $tc('Refresh') }}
    </v-btn>

    <app-confirm-dialog
      text="Хотите удалить?"
      @click:confirm="onBtnDeleteClick"
    >
      <template #activator="{ on }">
        <v-btn
          v-if="contactsIsSelected && $isGranted('CONTACTS_DELETE')"
          small
          tile
          text
          v-on="on"
        >
          {{ $tc('Delete') }}
        </v-btn>
      </template>
    </app-confirm-dialog>

    <contacts-list-menu-transfer v-if="contactsIsSelected && $isGranted('CONTACTS_TRANSFER')">
      <template #activator="{ on }">
        <v-btn
          small
          tile
          text
          v-on="on"
          @click="onBtnTransferContactsClick"
        >
          {{ $tc('Transfer contacts') }}
        </v-btn>
      </template>
    </contacts-list-menu-transfer>

    <!-- Добавление в автодозвон -->
    <template v-if="contactsIsSelected && $isGranted('AUTODIALER_MANAGEMENT')">
      <contacts-list-menu-add-to-autodialer>
        <template #activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            text
            small
            tile
            v-on="on"
          >
            {{ $tc('Add to autodial') }}
          </v-btn>
        </template>
      </contacts-list-menu-add-to-autodialer>
    </template>
    <!-- Добавление в автодозвон -->

    <!-- Импорт -->
    <template v-if="!contactsIsSelected && $isGranted('CONTACTS_IMPORT')">
      <contacts-list-menu-import>
        <template #activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            text
            small
            tile
            v-on="on"
          >
            {{ $tc('Import') }}
          </v-btn>
        </template>
      </contacts-list-menu-import>
    </template>
    <!-- Импорт -->

    <!-- Экспорт -->
    <template v-if="contactsIsSelected && $isGranted('CONTACTS_EXPORT')">
      <contacts-list-menu-export>
        <template #activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            text
            small
            tile
            v-on="on"
          >
            {{ $tc('Export') }}
          </v-btn>
        </template>
      </contacts-list-menu-export>
    </template>
    <!-- Экспорт -->

    <!-- Установка тегов -->
    <template v-if="contactsIsSelected && $isGranted('CONTACTS_ASSIGN_TAGS')">
      <contacts-list-menu-assign-tags>
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
      </contacts-list-menu-assign-tags>
    </template>
    <!-- Установка тегов -->

    <v-spacer />
    <app-pagination
      v-model="offset"
      :count="contactsTotal"
      :per-page="contactsPerPage"
    />
    <app-btn-sorting
      v-model="sorting"
      :label="$tc('Sorting')"
      :items="sortingOptions"
      item-text="name"
    />
  </div>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import AppBtnSorting from '@/components/AppBtnSorting/AppBtnSorting.vue'
import AppConfirmDialog from '@/components/AppConfirmDialog/AppConfirmDialog.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import Component from 'vue-class-component'
import { Emit } from 'vue-property-decorator'

@Component({
  components: {
    AppConfirmDialog,
    AppBtnSorting,
    AppPagination,
    ContactsListMenuTransfer: () => import('./ContactsListMenuTransfer.vue'),
    ContactsListMenuAssignTags: () => import('./ContactsListMenuAssignTags.vue'),
    ContactsListMenuImport: () => import('./ContactsListMenuImport.vue'),
    ContactsListMenuExport: () => import('./ContactsListMenuExport.vue'),
    ContactsListMenuAddToAutodialer: () => import('./ContactsListMenuAddToAutodialer.vue')
  }
})
export default class ContactsTools extends AppBase {
  @Emit('btn:click:add-to-autodialer')
  emitBtnAddToAutodialer () {
    return undefined
  }

  /** True - если есть выбранные контакты */
  get contactsIsSelected (): boolean {
    return this.$store.getters['contacts/list/items_selected'].length > 0
  }

  get contactsLoading (): boolean {
    return this.$store.getters['contacts/list/loading']
  }

  get offset (): number {
    return this.$store.getters['contacts/list/filter/filter_offset']
  }

  set offset (val: string|number) {
    this.$store.commit('contacts/list/filter/filter_offset', +val)
  }

  get contactsPerPage () { return this.$store.getters['contacts/list/per_page'] }
  get contactsTotal () { return this.$store.getters['contacts/list/items_total'] }

  get sorting (): Record<string, unknown> {
    return {
      order_by: this.$store.getters['contacts/list/filter/order_by'],
      order_direction: this.$store.getters['contacts/list/filter/order_direction']
    }
  }

  set sorting (val: Record<string, unknown>) {
    this.$store.commit('contacts/list/filter/order_by', val?.order_by)
    this.$store.commit('contacts/list/filter/order_direction', val?.order_direction)
  }

  get sortingOptions () {
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
  }

  private onBtnAddClick () {
    this.$store.commit('contacts/create/dialog_visible', true)
  }

  private onBtnRefreshClick () {
    this.$store.dispatch('contacts/list/fetch')
  }

  private onBtnCancelClick () {
    this.$store.dispatch('contacts/list/cancelFetch')
  }

  private onBtnDeleteClick () {
    // TODO: Handler
  }

  private onBtnTransferContactsClick () {
    this.$store.dispatch('contacts/transfer_dialog/show')
  }

  private onBtnImportClick () {
    this.$store.dispatch('contacts/transfer_dialog/show')
  }
}
</script>

<style scoped>

</style>

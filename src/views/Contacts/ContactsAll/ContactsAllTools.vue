<template>
  <div class="d-flex align-center">
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
          v-if="contactsIsSelected && $isGranted(['ROLE_ADMIN', 'ROLE_CCM'])"
          small
          tile
          text
          v-on="on"
        >
          {{ $tc('Delete') }}
        </v-btn>
      </template>
    </app-confirm-dialog>

    <contacts-list-menu-transfer v-if="contactsIsSelected && $isGranted(['ROLE_ADMIN', 'ROLE_CCM'])">
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
    <template v-if="contactsIsSelected && $isGranted(['ROLE_ADMIN', 'ROLE_CCM'])">
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
    <template v-if="!contactsIsSelected && $isGranted(['ROLE_ADMIN', 'ROLE_CCM'])">
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
    <template v-if="contactsIsSelected && $isGranted(['ROLE_ADMIN', 'ROLE_CCM'])">
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
    <template v-if="contactsIsSelected && $isGranted(['ROLE_ADMIN', 'ROLE_CCM'])">
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
      :disabled="contactsLoading"
      :count="contactsTotal"
      :per-page="contactsPerPage"
      class="mr-2"
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
    ContactsListMenuTransfer: () => import('./ContactsAllMenuTransfer.vue'),
    ContactsListMenuAssignTags: () => import('./ContactsAllMenuAssignTags.vue'),
    ContactsListMenuImport: () => import('./ContactsAllMenuImport.vue'),
    ContactsListMenuExport: () => import('./ContactsAllMenuExport.vue'),
    ContactsListMenuAddToAutodialer: () => import('./ContactsAllMenuAddToAutodialer.vue')
  }
})
export default class ContactsAllTools extends AppBase {
  @Emit('btn:click:add-to-autodialer')
  emitBtnAddToAutodialer () {
    return undefined
  }

  /** True - если есть выбранные контакты */
  get contactsIsSelected (): boolean {
    return this.$store.getters['contacts/contacts_all/items_selected'].length > 0
  }

  get contactsLoading (): boolean {
    return this.$store.getters['contacts/contacts_all/loading']
  }

  get offset (): number {
    return this.$store.getters['contacts/contacts_all/filter/filter_offset']
  }

  set offset (val: string|number) {
    this.$store.commit('contacts/contacts_all/filter/filter_offset', +val)
  }

  get contactsPerPage () { return this.$store.getters['contacts/contacts_all/per_page'] }
  get contactsTotal () { return this.$store.getters['contacts/contacts_all/items_total'] }

  get sorting (): Record<string, unknown> {
    return {
      order_by: this.$store.getters['contacts/contacts_all/filter/order_by'],
      order_direction: this.$store.getters['contacts/contacts_all/filter/order_direction']
    }
  }

  set sorting (val: Record<string, unknown>) {
    this.$store.commit('contacts/contacts_all/filter/order_by', val?.order_by)
    this.$store.commit('contacts/contacts_all/filter/order_direction', val?.order_direction)
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
    this.$store.dispatch('contacts/contacts_all/fetch')
  }

  private onBtnCancelClick () {
    this.$store.dispatch('contacts/contacts_all/cancelFetch')
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

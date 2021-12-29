<template>
  <v-sheet
    v-bind="vSheetAttrs"
    class="d-flex"
  >
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
      v-if="contactLoading"
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
      v-else
      style="min-width: 100px"
      small
      tile
      text
      @click="onBtnRefreshClick"
    >
      {{ $tc('Refresh') }}
    </v-btn>

    <v-btn
      v-if="contactsIsSelected && $isGranted('CONTACTS_DELETE')"
      small
      tile
      text
      @click="onBtnDeleteClick"
    >
      {{ $tc('Delete') }}
    </v-btn>
    <v-btn
      v-if="contactsIsSelected && $isGranted('CONTACTS_TRANSFER')"
      small
      tile
      text
      @click="onBtnTransferContactsClick"
    >
      {{ $tc('Transfer contacts') }}
    </v-btn>
    <v-btn
      v-if="contactsIsSelected && $isGranted('AUTODIALER_MANAGEMENT')"
      small
      tile
      text
      @click="emitBtnAddToAutodialer"
    >
      {{ $tc('Add to autodialer') }}
    </v-btn>

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
            @click="onBtnImportClick('csv')"
          >
            <v-list-item-content>
              <v-list-item-title>{{ $tc('Import from CSV') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $tc('Text format') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            link
            @click="onBtnImportClick('excel')"
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
    <template v-if="contactsIsSelected && $isGranted('CONTACTS_ASSIGN_TAGS')">
      <contacts-assign-tags>
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
      </contacts-assign-tags>
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
    <v-btn
      class="ml-1"
      small
      tile
      text
      @click="filterPanelVisible = !filterPanelVisible"
    >
      {{ $tc('Filter') }}
    </v-btn>
  </v-sheet>
</template>

<script lang="ts">
import Base from './Base'
import Component from 'vue-class-component'
import { Prop, Emit } from 'vue-property-decorator'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import AppBtnSorting from '@/components/AppBtnSorting/AppBtnSorting.vue'

@Component({
  components: {
    AppBtnSorting,
    AppPagination,
    ContactsAssignTags: () => import('./ContactsAssignTags.vue')
  }
})
export default class ContactListTools extends Base {
  @Prop({ default: false }) readonly outlined: boolean

  @Emit('btn:click:add-to-autodialer')
  emitBtnAddToAutodialer () {
    return undefined
  }

  /** True - если есть выбранные контакты */
  get contactsIsSelected (): boolean {
    return this.$store.getters['contacts/list/items_selected'].length > 0
  }

  get vSheetAttrs () {
    const attrs: Record<string, string|number|boolean|object> = {
      outlined: this.outlined
    }

    return attrs
  }

  get offset (): number {
    return this.$store.getters['contacts/list/filter/filter_offset']
  }

  set offset (val: string|number) {
    this.$store.commit('contacts/list/filter/filter_offset', +val)
  }

  get contactsPerPage () { return this.$store.getters['contacts/list/per_page'] }
  get contactsTotal () { return this.$store.getters['contacts/list/total'] }

  get sorting (): Record<string, any> {
    return {
      order_by: this.$store.getters['contacts/list/filter/order_by'],
      order_direction: this.$store.getters['contacts/list/filter/order_direction']
    }
  }

  set sorting (val: Record<string, any>) {
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

  get filterPanelVisible (): boolean {
    return this.$store.getters['contacts/list/filter/filter_panel_visible']
  }

  set filterPanelVisible (val: boolean) {
    this.$store.commit('contacts/list/filter/filter_panel_visible', val)
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

  private onBtnImportClick (val: string) {
    this.$store.dispatch('contacts/transfer_dialog/show')
  }
}
</script>

<style scoped>

</style>

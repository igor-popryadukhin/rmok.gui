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
      <v-icon>mdi-filter-outline</v-icon>
      {{ $tc('Filter') }}
    </v-btn>
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
    this.$store.dispatch('contacts/list_works/fetch')
  }

  private onBtnCancelClick () {
    this.$store.dispatch('contacts/list/cancelFetch')
  }

  private onBtnDeleteClick () {
    // TODO: Handler
  }
}
</script>

<style scoped>

</style>

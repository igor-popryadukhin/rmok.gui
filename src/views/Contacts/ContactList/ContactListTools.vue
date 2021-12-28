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
  </v-sheet>
</template>

<script lang="ts">
import Base from './Base'
import Component from 'vue-class-component'
import { Prop, Emit } from 'vue-property-decorator'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import AppBtnSorting from '@/components/AppBtnSorting/AppBtnSorting.vue'

@Component({
  components: { AppBtnSorting, AppPagination }
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
}
</script>

<style scoped>

</style>

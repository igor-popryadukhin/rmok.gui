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
      v-if="contactsIsSelected"
      small
      tile
      text
      @click="onBtnDeleteClick"
    >
      {{ $tc('Delete') }}
    </v-btn>
    <v-btn
      v-if="contactsIsSelected"
      small
      tile
      text
      @click="onBtnTransferContactsClick"
    >
      {{ $tc('Transfer contacts') }}
    </v-btn>
    <v-btn
      v-if="contactsIsSelected"
      small
      tile
      text
    >
      {{ $tc('Add to autodialer') }}
    </v-btn>

    <v-spacer />
    <app-pagination
      v-model="offset"
      :count="contactsTotal"
      :per-page="contactsPerPage"
    />
  </v-sheet>
</template>

<script lang="ts">
import Base from './Base'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'

@Component({
  components: { AppPagination }
})
export default class ContactListTools extends Base {
  @Prop({ default: false }) readonly outlined: boolean

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
    // TODO: Handler
  }
}
</script>

<style scoped>

</style>

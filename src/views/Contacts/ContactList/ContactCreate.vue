<template>
  <app-contact-edit-dialog
    :visible.sync="contactCreateDialogVisible"
    :title="$tc('Create a new contact')"
    :width="850"

    :field-first-name.sync="first_name"
    :field-last-name.sync="last_name"
    :field-middle-name.sync="middle_name"
  />
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Base from './Base'
import AppContactEditDialog from '@/components/AppContactEditDialog/AppContactEditDialog.vue'

@Component({
  components: { AppContactEditDialog }
})
export default class ContactCreate extends Base {
  get contactCreateDialogVisible () { return this.$store.getters['contacts/create/dialog_visible'] }
  set contactCreateDialogVisible (val: boolean) { this.$store.commit('contacts/create/dialog_visible', val) }

  get first_name () { return this.$store.getters['contacts/create/field_first_name'] }
  set first_name (val: string) { this.$store.commit('contacts/create/field_first_name', val) }

  get last_name () { return this.$store.getters['contacts/create/field_last_name'] }
  set last_name (val: string) { this.$store.commit('contacts/create/field_last_name', val) }

  get middle_name () { return this.$store.getters['contacts/create/field_middle_name'] }
  set middle_name (val: string) { this.$store.commit('contacts/create/field_middle_name', val) }
}
</script>

<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="450"
    persistent
  >
    <v-card
      tile
      flat
      elevation="10"
    >
      <v-card-title>
        {{ $tc('Transferring contacts') }}
      </v-card-title>
      <v-card-subtitle>
        {{ $tc('contact_selected', contactsListSelectedCount) }}
      </v-card-subtitle>
      <v-card-text>
        <app-autocomplete
          v-model="projectId"
          :options="availableProjects"
          :label="$tc('Projects')"
          item-text="name"
          item-value="id"
          clearable
          @search="onAppAutocompleteProjectsSearch"
          @focus="onAppAutocompleteProjectsSearch()"
        />
      </v-card-text>
      <v-card-text>
        <app-autocomplete
          v-model="userIds"
          :options="availableUsers"
          :label="$tc('Responsible')"
          item-text="full_name"
          item-value="id"
          clearable
          multiple
          @search="onSearchUsers"
          @focus="onSearchUsers()"
        >
          <template #selection="{ item, attrs, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              class="mb-1"
              close
              label
              outlined
              @click:close="onAppAutocompleteUsersChipCloseClick(item.id)"
            >
              <v-avatar
                size="16"
                left
              >
                <v-img
                  sizes="16,24,48,64,128"
                  src="/images/default-avatar.png"
                />
              </v-avatar>
              {{ item.full_name }}
            </v-chip>
          </template>
          <template #item="{ item, attrs, on }">
            <v-list-item
              v-bind="attrs"
              dense
              v-on="on"
            >
              <v-list-item-avatar>
                <img
                  sizes="16,24,48,64,128"
                  src="/images/default-avatar.png"
                >
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.full_name }}</v-list-item-title>
                <v-list-item-subtitle v-if="item.group">
                  {{ item.group.name }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </app-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red"
          small
          tile
          text
          @click="onBtnCancelClick"
        >
          {{ $tc('Cancel') }}
        </v-btn>
        <v-btn
          small
          tile
          text
          @click="onBtnTrasferClick"
        >
          {{ $tc('Transfer contacts') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import Component from 'vue-class-component'

@Component({
  components: { AppAutocomplete }
})
export default class ContactsTransferDialog extends AppBase {
  dialogVisible = true

  get contactsListSelectedCount () { return this.$store.getters['contacts/list/selected_count'] }

  get availableProjects () { return this.$store.getters['contacts/transfer_dialog/available_projects'] }
  get availableUsers () { return this.$store.getters['contacts/transfer_dialog/available_users'] }

  get projectId () { return this.$store.getters['contacts/transfer_dialog/project_id'] }
  set projectId (value: number) { this.$store.commit('contacts/transfer_dialog/project_id', value) }

  get userIds () { return this.$store.getters['contacts/transfer_dialog/user_ids'] }
  set userIds (value: number[]) { this.$store.commit('contacts/transfer_dialog/user_ids', value) }

  private onAppAutocompleteProjectsSearch (q = '') {
    if (this.availableProjects.findIndex((e: any) => e.name?.toLowerCase().indexOf(q?.toLowerCase()) > -1) === -1) {
      this.$store.dispatch('contacts/transfer_dialog/fetch_projects', {
        q
      })
    }
  }

  private onAppAutocompleteUsersChipCloseClick (userId: number) {
    this.userIds = this.userIds.filter(id => id !== userId)
  }

  private onSearchUsers (q = '') {
    const params: Record<string, unknown> = { q }
    if (this.projectId > 0) {
      params.project_id = this.projectId
    }

    if (this.availableUsers.findIndex((e: any) => e.full_name?.toLowerCase().indexOf(q?.toLowerCase()) > -1) === -1) {
      this.$store.dispatch('contacts/transfer_dialog/fetch_users', params)
    }
  }

  private onBtnCancelClick () {
    this.$store.dispatch('contacts/transfer_dialog/hide')
  }

  private onBtnTrasferClick () {
    this.$store.dispatch('contacts/transfer_dialog/transfer')
  }
}
</script>

<i18n>
{
  "ru": {
    "Required field.": "Обязательное поле.",
    "Transferring contacts": "Передача контактов",
    "Date the contact was created": "Дата создания контакта",
    "Leave this field blank if you do not want to change the previous value.": "Оставьте поле пустым, если вы не хотите изменять предыдущее значение.",
    "Transfer contacts": "Передать контакты",
    "contact_selected": "Контакты не выбраны | Выбран {n} контакт | Выбрано {n} контакта | Выбрано {n} контактов"
  }
}
</i18n>

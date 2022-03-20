<template>
  <div class="py-2">
    <v-text-field
      v-model="q"
      :label="$t('Search')"
      prepend-inner-icon="mdi-magnify"
      clearable
      outlined
      dense
      @change="onFilterChange"
    />

    <smart-autocomplete
      v-if="$isGranted(['ROLE_ADMIN', 'ROLE_CCM', 'ROLE_TEAM_LEADER'])"
      v-model="project"
      :label="$tc('Project')"
      :api-query="(q) => { return { q } }"
      :items="project ? [project] : []"
      api-end-point="/projects"
      item-text="name"
      item-value="id"
      response-property="data"
      store-module-name="projects"
      clearable
    />

    <smart-autocomplete
      v-model="statuses"
      :label="$tc('Result')"
      :api-query="(q) => { return {
        ...(!!q ? { q } : {}),
        ...(!!project ? { project_id: project.id } : {}) } }"
      :items="statuses ? statuses : []"
      :filter="(item) => !!item.project && !!project && item.project.id === project.id"
      api-end-point="/statuses"
      item-text="name"
      item-value="id"
      store-module-name="statuses"
      clearable
      multiple
    >
      <template
        #item="{ item, on, attrs }"
      >
        <v-list-item
          v-bind="attrs"
          :color="item.color"
          :input-value="item.id"
          v-on="on"
        >
          {{ item.name }}
        </v-list-item>
      </template>

      <template
        #selection="{ item }"
      >
        <v-chip
          class="extra-small-chip"
          :color="item.color"
          outlined
          label
          close
          x-small
          @click:close="onStatusChipClose(item.id)"
        >
          {{ item.name }}
        </v-chip>
      </template>
    </smart-autocomplete>

    <smart-autocomplete
      v-if="$isGranted(['ROLE_ADMIN', 'ROLE_CCM', 'ROLE_TEAM_LEADER'])"
      v-model="userGroup"
      :label="$tc('Group')"
      :api-query="(q) => { return { q } }"
      :items="userGroup ? [userGroup] : []"
      api-end-point="/groups"
      item-text="name"
      item-value="id"
      response-property="data"
      store-module-name="groups"
      clearable
    />

    <smart-autocomplete
      v-if="$isGranted(['ROLE_ADMIN', 'ROLE_CCM', 'ROLE_TEAM_LEADER'])"
      v-model="user"
      :label="$tc('Responsible')"
      :filter="(item) => !!item.project && !!project && item.project.id === project.id"
      :api-query="(q) => { return {
        ...(!!q ? { q } : {}),
        ...(!!project ? { project_id: project.id } : {}) } }"
      :items="user ? [user] : []"
      api-end-point="/users"
      item-text="full_name"
      item-value="id"
      response-property="data"
      store-module-name="users"
      clearable
    />

    <v-select
      v-model="task"
      clearable
      :label="$tc('Tasks')"
      :items="filterTasksItems"
      outlined
      dense
      @change="onFilterChange"
    />

    <v-select
      v-model="called"
      label="Прозвонено"
      :items="callingOptions"
      item-text="text"
      item-value="value"
      clearable
      outlined
      dense
      @change="onFilterChange"
    />

    <smart-autocomplete
      v-model="tags"
      :label="$tc('Tags')"
      :api-query="(q) => { return { q } }"
      :items="tags ? tags : []"
      api-end-point="/contacts/tags"
      item-color="color"
      item-text="name"
      item-value="id"
      response-property="data"
      store-module-name="tags"
      clearable
      multiple
    >
      <template
        #item="{ item, on, attrs }"
      >
        <v-list-item
          v-bind="attrs"
          :color="item.color"
          :input-value="item.id"
          v-on="on"
        >
          {{ item.name }}
        </v-list-item>
      </template>

      <template
        #selection="{ item }"
      >
        <v-chip
          class="extra-small-chip"
          :color="item.color"
          outlined
          label
          close
          x-small
          @click:close="onTagsChipClose(item.id)"
        >
          {{ item.name }}
        </v-chip>
      </template>
    </smart-autocomplete>

    <smart-autocomplete
      v-model="timeZone"
      :label="$tc('Time zone')"
      api-end-point="/handbooks/timezones"
      :items="timeZone ? [timeZone] : []"
      item-text="name_local"
      item-value="id"
      store-module-name="timezones"
      clearable
    >
      <template #item="{ item, attrs, on }">
        <v-list-item
          v-bind="attrs"
          v-on="on"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.name_local }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>
              {{ item.offset_string }}
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </template>
    </smart-autocomplete>

    <app-menu-date-picker
      v-model="contactCreatedAt"
      range
    >
      <template #activator="{ on, text }">
        <v-text-field
          :label="$tc('Date the contact was created')"
          :value="text"
          readonly
          dense
          outlined
          clearable
          v-on="on"
          @click:clear="contactCreatedAt = []"
        />
      </template>
    </app-menu-date-picker>
  </div>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue'
import SmartAutocomplete from '@/smart-components/SmartAutocomplete/SmartAutocomplete.vue'
import debounce from '@/utils/debounce'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<ContactsAllFilters>({
  components: { SmartAutocomplete, AppMenuDatePicker, AppAutocomplete }
})
export default class ContactsAllFilters extends AppBase {

  // region Параметры запроса
  get q () { return this.$store.getters['contacts/contacts_all/filter/filter_q'] }
  set q (val) { this.$store.commit('contacts/contacts_all/filter/filter_q', val) }

  get project () {
    return this.$store.getters['contacts/contacts_all/filter/filter_project'] ||
      this.$store.getters['profile/current_project']
  }
  set project (val) {
    this.$store.commit('contacts/contacts_all/filter/filter_project', val)
    this.$store.commit('contacts/contacts_all/filter/filter_offset', 0)
  }

  get statuses () { return this.$store.getters['contacts/contacts_all/filter/filter_statuses'] }
  set statuses (val) {
    this.$store.commit('contacts/contacts_all/filter/filter_statuses', val)
    this.$store.commit('contacts/contacts_all/filter/filter_offset', 0)
  }

  get userGroup () { return this.$store.getters['contacts/contacts_all/filter/filter_user_group'] }
  set userGroup (val) {
    this.$store.commit('contacts/contacts_all/filter/filter_user_group', val)
    this.$store.commit('contacts/contacts_all/filter/filter_offset', 0)
  }

  get user () { return this.$store.getters['contacts/contacts_all/filter/filter_owner'] }
  set user (val) {
    this.$store.commit('contacts/contacts_all/filter/filter_owner', val)
    this.$store.commit('contacts/contacts_all/filter/filter_offset', 0)
  }

  get task (): string { return this.$store.getters['contacts/contacts_all/filter/filter_task'] }
  set task (val: string) {
    this.$store.commit('contacts/contacts_all/filter/filter_task', val)
    this.$store.commit('contacts/contacts_all/filter/filter_offset', 0)
  }

  get called (): string { return this.$store.getters['contacts/contacts_all/filter/filter_called'] }
  set called (val: string) {
    this.$store.commit('contacts/contacts_all/filter/filter_called', val)
    this.$store.commit('contacts/contacts_all/filter/filter_offset', 0)
  }

  get tags () { return this.$store.getters['contacts/contacts_all/filter/filter_tags'] }
  set tags (val) {
    this.$store.commit('contacts/contacts_all/filter/filter_tags', val)
    this.$store.commit('contacts/contacts_all/filter/filter_offset', 0)
  }

  get timeZone () { return this.$store.getters['contacts/contacts_all/filter/filter_timezone'] }
  set timeZone (val) {
    this.$store.commit('contacts/contacts_all/filter/filter_timezone', val)
    this.$store.commit('contacts/contacts_all/filter/filter_offset', 0)
  }

  get contactCreatedAt (): string[] {
    const dates = String(this.$store.getters['contacts/contacts_all/filter/filter_contact_created_at'] || '')
      .split('|')
    if (dates.length === 2) {
      return dates
    }
    return []
  }

  set contactCreatedAt (val: string[]) {
    if (Array.isArray(val) && val.length === 2) {
      this.$store.commit('contacts/contacts_all/filter/filter_contact_created_at', val.join('|'))
      this.$store.commit('contacts/contacts_all/filter/filter_offset', 0)
    } else if (Array.isArray(val) && val.length === 0) {
      this.$store.commit('contacts/contacts_all/filter/filter_contact_created_at', '')
      this.$store.commit('contacts/contacts_all/filter/filter_offset', 0)
    }
  }

  // endregion Параметры запроса

  // region Данные для заполнения фильтров

  get filterTasksItems () {
    return ['available', 'unavailable', 'overdue', 'not_overdue'].map((e) => {
      return {
        value: e,
        text: this.$tc(`ContactsFilters.Tasks.${e}`)
      }
    })
  }

  get callingOptions () {
    return [
      { text: 'Yes', value: 'yes' },
      { text: 'No', value: 'no' }
    ].map((e) => {
      return {
        value: e.value,
        text: this.$tc(e.text)
      }
    })
  }
  // endregion

  // region Обработчики жизненного цикла
  created () {
    this.onFilterChange = debounce(this.onFilterChange, 350)
  }

  // endregion

  // region Вспомогательные метод и обработчики

  /**
   * Срабатывает при изменении значений одного из фильтров
   * @private
   */
  private onFilterChange () {
    this.$store.commit('contacts/contacts_all/filter/filter_offset', 0)
  }

  /**
   * @param id
   * @private
   */
  private onTagsChipClose (id: number) {
    this.tags = this.tags.filter((value) => {
      return value.id !== id
    })
  }

  /**
   * @param id
   * @private
   */
  private onStatusChipClose (id: number) {
    this.statuses = this.statuses.filter((value) => {
      return value.id !== id
    })
  }

  private onContactCreatedAtBtnOkClick (value: string[]) {
    // @ts-expect-error: Contact created at
    return this.$refs.contactCreatedAtMenu?.save(value)
  }
  // endregion
}
</script>

<style scoped>
.extra-small-chip >>> span > button {
  font-size: 13px !important;
}
</style>

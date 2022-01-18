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
      v-if="$isGranted(['CONTACTS_VIEW_ALL'])"
      v-model="projectId"
      :label="$tc('Project')"
      :api-query="(q) => { return { q } }"
      api-end-point="/projects"
      item-text="name"
      item-value="id"
      response-property="data"
      store-module-name="projects"
      clearable
    />

    <smart-autocomplete
      v-model="statusIds"
      :disabled="!projectId"
      :label="$tc('Result')"
      :filter="(item) => item.project.id === projectId"
      :api-query="(q) => { return { q, project_id: projectId } }"
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
      v-if="$isGranted(['CONTACTS_VIEW_ALL', 'CONTACTS_VIEW_ONLY_GROUP'])"
      v-model="userGroupId"
      :label="$tc('Group')"
      :api-query="(q) => { return { q } }"
      api-end-point="/groups"
      item-text="name"
      item-value="id"
      response-property="data"
      store-module-name="groups"
      clearable
    />

    <smart-autocomplete
      v-if="$isGranted(['CONTACTS_VIEW_ALL', 'CONTACTS_VIEW_ONLY_GROUP'])"
      v-model="userId"
      :label="$tc('Responsible')"
      :filter="(item) => item.project.id === projectId"
      :api-query="(q) => { return {q, project_id: projectId} }"
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
      v-model="calling"
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
      v-model="tagIds"
      :label="$tc('Tags')"
      :api-query="(q) => { return { q } }"
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
      v-model="timeZoneId"
      :label="$tc('Time zone')"
      api-end-point="/handbooks/timezones"
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

    <v-menu
      ref="contactCreatedAtMenu"
      v-model="contactCreatedAtMenu"
      :return-value.sync="contactCreatedAt"
      :close-on-content-click="false"
      transition="scale-transition"
      min-width="auto"
      offset-y
      offset-x
      left
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          :label="$tc('Date the contact was created')"
          :value="dateRangeText"
          multiple
          dense
          outlined
          prepend-inner-icon="mdi-calendar"
          readonly
          clearable
          v-bind="attrs"
          v-on="on"
          @click:clear="contactCreatedAt = []; contactCreatedAtDates = [];"
        />
      </template>
      <v-date-picker
        v-model="contactCreatedAtDates"
        :first-day-of-week="1"
        locale="ru"
        flat
        range
        no-title
        show-current
      >
        <v-spacer />
        <v-btn
          text
          color="primary"
          small
          @click="contactCreatedAtMenu = false"
        >
          {{ $tc('Cancel') }}
        </v-btn>
        <v-btn
          text
          color="primary"
          small
          @click="onContactCreatedAtBtnOkClick(contactCreatedAtDates)"
        >
          {{ $tc('Ok') }}
        </v-btn>
      </v-date-picker>
    </v-menu>
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
@Component<ContactListFilters>({
  components: { SmartAutocomplete, AppMenuDatePicker, AppAutocomplete }
})
export default class ContactListFilters extends AppBase {
  // region Данные
  contactCreatedAtMenu = false
  contactCreatedAtDates = []
  // endregion

  /** Текущий проект пользователя */
  get profileProjectId (): number { return this.$store.getters['profile/project/id'] }

  get dateRangeText (): string {
    if (Array.isArray(this.contactCreatedAt) && this.contactCreatedAt.length === 2) {
      let contactCreatedAtStart = this.$dayjs(this.contactCreatedAt[0], 'YYYY-MM-DD')
      let contactCreatedAtEnd = this.$dayjs(this.contactCreatedAt[1], 'YYYY-MM-DD')

      contactCreatedAtStart = contactCreatedAtStart.set('hour', 0).set('minute', 0).set('second', 0)
      contactCreatedAtEnd = contactCreatedAtEnd.set('hour', 23).set('minute', 59).set('second', 59)

      if (contactCreatedAtStart.toDate() > contactCreatedAtEnd.toDate()) {
        return contactCreatedAtEnd.format('DD.MM.YYYY') + ' - ' + contactCreatedAtStart.format('DD.MM.YYYY')
      } else {
        return contactCreatedAtStart.format('DD.MM.YYYY') + ' - ' + contactCreatedAtEnd.format('DD.MM.YYYY')
      }
    } else if (Array.isArray(this.contactCreatedAt) && this.contactCreatedAt.length === 1) {
      let contactCreatedAtStart = this.$dayjs(this.contactCreatedAt[0], 'YYYY-MM-DD')
      let contactCreatedAtEnd = this.$dayjs(this.contactCreatedAt[0], 'YYYY-MM-DD')

      contactCreatedAtStart = contactCreatedAtStart.set('hour', 0).set('minute', 0).set('second', 0)
      contactCreatedAtEnd = contactCreatedAtEnd.set('hour', 23).set('minute', 59).set('second', 59)

      return contactCreatedAtStart.format('DD.MM.YYYY') + ' - ' + contactCreatedAtEnd.format('DD.MM.YYYY')
    }
    return ''
  }

  // region Параметры запроса
  get q (): string|null { return this.$store.getters['contacts/list/filter/filter_q'] }

  set q (val: string|null) { this.$store.commit('contacts/list/filter/filter_q', val) }

  get projectId (): number|null {
    return this.$store.getters['contacts/list/filter/filter_project_id'] ||
      this.profileProjectId
  }

  set projectId (val: number) {
    this.$store.commit('contacts/list/filter/filter_project_id', val)

    // Сброс состояния связанных фильтров
    this.$store.commit('contacts/list/filter/filter_owner_id', 0)
    this.$store.commit('contacts/list/filter/filter_status_ids', [])
  }

  get statusIds (): number[] {
    return this.$store.getters['contacts/list/filter/filter_status_ids']
  }

  set statusIds (val: string|number|(string|number)[]) {
    this.$store.commit('contacts/list/filter/filter_status_ids', val)
  }

  get userGroupId (): number|null { return this.$store.getters['contacts/list/filter/filter_user_group_id'] }

  set userGroupId (val: string|number) {
    this.$store.commit('contacts/list/filter/filter_user_group_id', val)
  }

  get userId (): number|null { return this.$store.getters['contacts/list/filter/filter_owner_id'] }

  set userId (val: string|number) {
    this.$store.commit('contacts/list/filter/filter_owner_id', val)
  }

  get task (): string { return this.$store.getters['contacts/list/filter/filter_task'] }

  set task (val: string) { this.$store.commit('contacts/list/filter/filter_task', val) }

  get calling (): string { return this.$store.getters['contacts/list/filter/filter_calling'] }

  set calling (val: string) { this.$store.commit('contacts/list/filter/filter_calling', val) }

  get tagIds (): number[] {
    return this.$store.getters['contacts/list/filter/filter_tag_ids']
  }

  set tagIds (val: number[]) {
    this.$store.commit('contacts/list/filter/filter_tag_ids', val)
  }

  get timeZoneId (): number {
    return this.$store.getters['contacts/list/filter/filter_timezone_id']
  }

  set timeZoneId (val: number) {
    this.$store.commit('contacts/list/filter/filter_timezone_id', val)
  }

  get contactCreatedAt (): string[] {
    return this.$store.getters['contacts/list/filter/filter_contact_created_at']
  }

  set contactCreatedAt (val: string[]) {
    this.$store.commit('contacts/list/filter/filter_contact_created_at', val)
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

  mounted () {
    if (this.contactCreatedAt.length === 2) {
      this.contactCreatedAtDates = this.contactCreatedAt
    }
  }
  // endregion

  // region Вспомогательные метод и обработчики

  /**
   * Срабатывает при изменении значений одного из фильтров
   * @private
   */
  private onFilterChange () {
    this.$store.commit('contacts/list/filter/filter_offset', 0)
  }

  /**
   * @param id
   * @private
   */
  private onTagsChipClose (id: number) {
    this.tagIds = this.tagIds.filter((value) => {
      return value !== id
    })
  }

  /**
   * @param id
   * @private
   */
  private onStatusChipClose (id: number) {
    this.statusIds = this.statusIds.filter((value) => {
      return value !== id
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

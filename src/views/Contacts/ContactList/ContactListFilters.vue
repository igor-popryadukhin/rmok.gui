<template>
  <v-sheet>
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

      <app-autocomplete
        v-model="projectId"
        :options="projects"
        :label="$tc('Project')"
        :value="projectId"
        item-text="name"
        item-value="id"
        clearable
        @search="onAppAutocompleteProjectsSearch"
        @focus="onAppAutocompleteProjectsSearchFocus"
        @change="onFilterChange"
        @mounted="$appDebug"
      />

      <app-autocomplete
        v-model="statusIds"
        :options="statuses"
        :label="$tc('Result')"
        :value="statusIds"
        :disabled="!(projectId > 0)"
        :loading="statusesLoading"
        item-text="name"
        item-value="id"
        item-color="color"
        clearable
        multiple
        @search="onAppAutocompleteStatusesSearch"
        @focus="onAppAutocompleteStatusesFocus"
        @change="onFilterChange"
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
            @click:close="onAppAutocompleteStatusesClose(item.id)"
          >
            {{ item.name }}
          </v-chip>
        </template>
      </app-autocomplete>

      <app-autocomplete
        v-model="userGroupId"
        :options="userGroups"
        :label="$tc('Group')"
        :value="userGroupId"
        :loading="userGroupsLoading"
        item-text="name"
        item-value="id"
        clearable
        @search="onSearchUsersGroups"
        @focus="onAppAutocompleteUserGroupsFocus"
        @change="onFilterChange"
      />

      <app-autocomplete
        v-model="userId"
        :options="users"
        :label="$tc('Responsible')"
        :loading="usersLoading"
        item-text="full_name"
        item-value="id"
        clearable
        @search="onSearchUsers"
        @focus="onUsersFocus"
        @change="onFilterChange"
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

      <app-autocomplete
        v-model="tagIds"
        :options="tags"
        :label="$tc('Tags')"
        :loading="tagsLoading"
        item-text="name"
        item-value="id"
        item-color="color"
        chips
        deletable-chips
        multiple
        clearable
        @search="onSearchTags"
        @focus="onSearchTags()"
        @change="onFilterChange"
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
      </app-autocomplete>

      <app-autocomplete
        v-model="utcOffset"
        :options="utcOffsetOptions"
        item-text="name"
        item-value="value"
        clearable
        @change="onFilterChange"
      />

      <v-menu
        ref="contactCreatedAtMenu"
        v-model="contactCreatedAtMenu"
        :return-value.sync="contactCreatedAt"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
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
  </v-sheet>
</template>

<script lang="ts">
import Base from './Base'
import Component from 'vue-class-component'
import debounce from '@/utils/debounce'
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import ContactTag from '@/api/interfaces/ContactTag'
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue'

// eslint-disable-next-line no-use-before-define
@Component<ContactListFilters>({
  components: { AppMenuDatePicker, AppAutocomplete }
})
export default class ContactListFilters extends Base {
  // region Данные
  contactCreatedAtMenu = false
  contactCreatedAtDates = []
  statusesLoading = false
  userGroupsLoading = false
  usersLoading = false
  tagsLoading = false
  // endregion

  get profileProjectId (): number { return this.$store.getters['profile/project/id'] }

  get dateRangeText (): string {
    if (Array.isArray(this.contactCreatedAt) && this.contactCreatedAt.length === 2) {
      let contactCreatedAtStart = this.$dayjs(this.contactCreatedAt[0], 'YYYY-MM-DD')
      let contactCreatedAtEnd = this.$dayjs(this.contactCreatedAt[1], 'YYYY-MM-DD')

      contactCreatedAtStart = contactCreatedAtStart.set('hour', 0).set('minute', 0).set('second', 0)
      contactCreatedAtEnd = contactCreatedAtEnd.set('hour', 23).set('minute', 59).set('second', 59)

      if (contactCreatedAtStart.unix() > contactCreatedAtEnd.unix()) {
        return 'c ' + contactCreatedAtEnd.format('DD.MM.YYYY') + ' по ' + contactCreatedAtStart.format('DD.MM.YYYY')
      } else {
        return 'c ' + contactCreatedAtStart.format('DD.MM.YYYY') + ' по ' + contactCreatedAtEnd.format('DD.MM.YYYY')
      }
    }
    return ''
  }

  // region Параметры запроса
  get q (): string|null { return this.$store.getters['contacts/list/filter/filter_q'] }

  set q (val: string|null) { this.$store.commit('contacts/list/filter/filter_q', val) }

  get projectId (): number|null { return this.$store.getters['contacts/list/filter/filter_project_id'] }

  set projectId (val: string|number) {
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

  get utcOffset (): number {
    return this.$store.getters['contacts/list/filter/filter_utc_offset']
  }

  set utcOffset (val: number) {
    this.$store.commit('contacts/list/filter/filter_utc_offset', val)
  }

  get contactCreatedAt (): string[] {
    return this.$store.getters['contacts/list/filter/filter_contact_created_at']
  }

  set contactCreatedAt (val: string[]) {
    this.$store.commit('contacts/list/filter/filter_contact_created_at', val)
  }

  // endregion Параметры запроса

  // region Данные для заполнения фильтров
  get projects (): Record<string, any>[] { return this.$store.getters['contacts/list/filter/projects'] }

  get statuses (): Record<string, any>[] {
    if (!this.projectId) {
      return []
    }
    return (this.$store.getters['contacts/list/filter/statuses'] as Record<string, any>[]).filter((e) => e.project.id === this.projectId)
  }

  get users (): Record<string, any>[] {
    const users: Record<string, any>[] = this.$store.getters['contacts/list/filter/users']
    return users.filter((e) => {
      return e?.project?.id === this.projectId
    })
  }

  get userGroups (): Record<string, any>[] { return this.$store.getters['contacts/list/filter/user_groups'] }

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

  get tags (): ContactTag[] {
    const tags = this.$store.getters['contacts/list/filter/tags'] as Record<string, any>[]
    return [].concat([
      {
        id: 0,
        name: this.$tc('No tags'),
        color: 'grey'
      }
    ], tags)
  }

  get utcOffsetOptions () {
    return [
      {
        name: '+2 Калининград',
        value: 2
      },
      {
        name: '+3 Москва',
        value: 3
      },
      {
        name: '+4 Самара',
        value: 4
      },
      {
        name: '+5 Екатеринбург',
        value: 5
      },
      {
        name: '+6 Омск',
        value: 6
      },
      {
        name: '+7 Красноярск',
        value: 7
      },
      {
        name: '+8 Иркутск',
        value: 8
      },
      {
        name: '+9 Якутск',
        value: 9
      },
      {
        name: '+10 Владивосток',
        value: 10
      },
      {
        name: '+11 Магадан',
        value: 11
      },
      {
        name: '+12 Камчатка',
        value: 12
      }
    ]
  }
  // endregion

  // region Обработчики жизненного цикла
  created () {
    this.onFilterChange = debounce(this.onFilterChange, 350)
    this.onSearchUsers = debounce(this.onSearchUsers, 500)
    this.onSearchTags = debounce(this.onSearchTags, 500)
    this.onAppAutocompleteProjectsSearch = debounce(this.onAppAutocompleteProjectsSearch, 500)
    this.onAppAutocompleteStatusesSearch = debounce(this.onAppAutocompleteStatusesSearch, 500)
  }

  mounted () {
    if (this.projectId > 0) { this.onAppAutocompleteProjectsSearchFocus() }
    if (this.statusIds.length > 0) { this.onAppAutocompleteStatusesFocus() }
    if (this.userGroupId > 0) { this.onAppAutocompleteUserGroupsFocus() }
    if (this.tagIds.length > 0) { this.onSearchTags() }

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
   * Срабатывает при поиске проектов
   * @param q
   * @private
   */
  private onAppAutocompleteProjectsSearch (q = '') {
    if (this.projects.findIndex((e: any) => e.name?.toLowerCase().indexOf(q?.toLowerCase()) > -1) === -1) {
      this.$store.dispatch('contacts/list/filter/fetchProjects', {
        q
      })
    }
  }

  private onAppAutocompleteProjectsSearchFocus () {
    if (this.projects.length === 0) { this.$store.dispatch('contacts/list/filter/fetchProjects', {}) }
  }

  private onAppAutocompleteStatusesSearch (q = '') {
    if (this.projects.findIndex((e: any) => e.name?.toLowerCase().indexOf(q?.toLowerCase()) > -1) === -1) {
      this.statusesLoading = true
      this.$store.dispatch('contacts/list/filter/fetchStatuses', {
        q
      }).finally(() => (this.statusesLoading = false))
    }
  }

  /**
   * Срабатывает при фокусе на фильтр "Проект"
   * @private
   */
  private onAppAutocompleteStatusesFocus () {
    const params: Record<string, any> = {}
    if (this.projectId > 0) {
      params.project_id = this.projectId
    }
    if (this.statuses.length === 0) {
      this.statusesLoading = true
      this.$store.dispatch('contacts/list/filter/fetchStatuses', params)
        .finally(() => (this.statusesLoading = false))
    }
  }

  private onAppAutocompleteStatusesClose (id: number) {
    this.$store.commit('contacts/list/filter/filter_offset', 0)
    this.statusIds = this.statusIds.filter((value) => {
      return value !== id
    })
  }

  private onAppAutocompleteUserGroupsFocus () {
    if (this.userGroups.length === 0) { this.$store.dispatch('contacts/list/filter/fetchUserGroups', {}) }
  }

  private onSearchUsersGroups (q = '') {
    if (this.userGroups.findIndex((e: any) => e.name?.toLowerCase().indexOf(q?.toLowerCase()) > -1) === -1) {
      this.userGroupsLoading = true
      this.$store.dispatch('contacts/list/filter/fetchUserGroups', {
        q
      }).finally(() => (this.userGroupsLoading = false))
    }
  }

  private onSearchUsers (q = '') {
    const params: Record<string, any> = { q }
    if (this.projectId > 0) {
      params.project_id = this.projectId
    }

    if (this.users.findIndex((e: any) => e.full_name?.toLowerCase().indexOf(q?.toLowerCase()) > -1) === -1) {
      this.usersLoading = true
      this.$store.dispatch('contacts/list/filter/fetchUsers', params)
        .finally(() => (this.usersLoading = false))
    }
  }

  private onUsersFocus () {
    const params: Record<string, any> = {}
    if (this.projectId > 0) {
      params.project_id = this.projectId
    }

    if (this.users.length === 0) {
      this.usersLoading = true
      this.$store.dispatch('contacts/list/filter/fetchUsers', params)
        .finally(() => (this.usersLoading = false))
    }
  }

  /**
   * Срабатывает при поиске тегов
   * @param q
   * @private
   */
  private onSearchTags (q = '') {
    const params: Record<string, any> = { q }
    const fetch = this.tags.findIndex((e) => e.name.toLowerCase().indexOf((q || '').toLowerCase()) > -1) === -1 ||
      this.tags.length === 0

    if (fetch) {
      this.tagsLoading = true
      this.$store.dispatch('contacts/list/filter/fetchTags', params)
        .finally(() => (this.tagsLoading = false))
    }
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

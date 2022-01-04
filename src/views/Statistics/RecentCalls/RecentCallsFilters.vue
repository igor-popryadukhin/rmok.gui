<template>
  <v-sheet>
    <div class="py-2">
      <!-- Проект -->
      <app-autocomplete
        v-if="$isGranted(['CONTACTS_VIEW_ALL'])"
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
      <!-- Проект -->

      <!-- Результат/статус -->
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
      <!-- Результат/статус -->

      <!-- Группа -->
      <app-autocomplete
        v-if="$isGranted(['CONTACTS_VIEW_ALL', 'CONTACTS_VIEW_ONLY_GROUP'])"
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
      <!-- Группа -->

      <!-- Ответственный -->
      <app-autocomplete
        v-if="$isGranted(['CONTACTS_VIEW_ALL', 'CONTACTS_VIEW_ONLY_GROUP'])"
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
      <!-- Ответственный -->

      <!-- Задача -->
      <v-select
        v-model="task"
        clearable
        :label="$tc('Tasks')"
        :items="filterTasksItems"
        outlined
        dense
        @change="onFilterChange"
      />
      <!-- Задача -->

      <!-- Is calling -->
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
      <!-- Is calling -->

      <!-- Теги -->
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
      <!-- Теги -->

      <!-- Временная зона контакта -->
      <app-autocomplete
        v-model="timeZoneId"
        :options="timezones"
        :label="$tc('Time zone')"
        item-text="name_local"
        item-value="id"
        clearable
        @focus="fetchTimeZones"
        @change="onFilterChange"
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
      </app-autocomplete>
      <!-- Временная зона контакта -->

      <!-- Дата и время создания контакта -->
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
      <!-- Дата и время создания контакта -->
    </div>
    <v-divider />
    <div class="py-2">
      <v-btn
        :loading="refreshLoading"
        block
        text
        tile
        @click="btnRefreshClick"
      >
        <template #loader>
          Loading
        </template>
        {{ $tc('Refresh') }}
      </v-btn>
    </div>
  </v-sheet>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import debounce from '@/utils/debounce'
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import ContactTag from '@/api/interfaces/ContactTag'
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue'
import AppBase from '@/AppBase'
import { Emit } from 'vue-property-decorator'

// eslint-disable-next-line no-use-before-define
@Component<RecentCallsFilters>({
  components: { AppMenuDatePicker, AppAutocomplete }
})
export default class RecentCallsFilters extends AppBase {
  @Emit('btn:refresh:click')
  private btnRefreshClick () {
    return undefined
  }

  // region Данные
  contactCreatedAtMenu = false
  contactCreatedAtDates = []
  statusesLoading = false
  userGroupsLoading = false
  usersLoading = false
  tagsLoading = false
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

  get refreshLoading () {
    return this.$store.getters['statistics/recent_calls/pie_fetching']
  }

  // region Параметры запроса

  get projectId (): number|null {
    return this.$store.getters['statistics/recent_calls/filter/project_id'] ||
      this.profileProjectId
  }

  set projectId (val: number) {
    this.$store.commit('statistics/recent_calls/filter/project_id', val)

    // Сброс состояния связанных фильтров
    this.$store.commit('statistics/recent_calls/filter/owner_id', 0)
    this.$store.commit('statistics/recent_calls/filter/status_ids', [])
  }

  get statusIds (): number[] {
    return this.$store.getters['statistics/recent_calls/filter/status_ids']
  }

  set statusIds (val: string|number|(string|number)[]) {
    this.$store.commit('statistics/recent_calls/filter/status_ids', val)
  }

  get userGroupId (): number|null { return this.$store.getters['statistics/recent_calls/filter/user_group_id'] }

  set userGroupId (val: string|number) {
    this.$store.commit('statistics/recent_calls/filter/user_group_id', val)
  }

  get userId (): number|null { return this.$store.getters['statistics/recent_calls/filter/owner_id'] }

  set userId (val: string|number) {
    this.$store.commit('statistics/recent_calls/filter/owner_id', val)
  }

  get task (): string { return this.$store.getters['statistics/recent_calls/filter/task'] }

  set task (val: string) { this.$store.commit('statistics/recent_calls/filter/task', val) }

  get calling (): string { return this.$store.getters['statistics/recent_calls/filter/calling'] }

  set calling (val: string) { this.$store.commit('statistics/recent_calls/filter/calling', val) }

  get tagIds (): number[] {
    return this.$store.getters['statistics/recent_calls/filter/tag_ids']
  }

  set tagIds (val: number[]) {
    this.$store.commit('statistics/recent_calls/filter/tag_ids', val)
  }

  get timeZoneId (): number {
    return this.$store.getters['statistics/recent_calls/filter/timezone_id']
  }

  set timeZoneId (val: number) {
    this.$store.commit('statistics/recent_calls/filter/timezone_id', val)
  }

  get contactCreatedAt (): string[] {
    return this.$store.getters['statistics/recent_calls/filter/contact_created_at']
  }

  set contactCreatedAt (val: string[]) {
    this.$store.commit('statistics/recent_calls/filter/contact_created_at', val)
  }

  // endregion Параметры запроса

  // region Данные для заполнения фильтров
  get projects (): Record<string, any>[] { return this.$store.getters['statistics/recent_calls/filter/projects'] }

  /** Статусы */
  get statuses (): Record<string, any>[] {
    if (!this.projectId) {
      return []
    }
    return (this.$store.getters['statistics/recent_calls/filter/statuses'] as Record<string, any>[])
      .filter((e) => e.project.id === this.projectId)
  }

  /** Пользователи */
  get users (): Record<string, any>[] {
    if (this.projectId) {
      return (this.$store.getters['statistics/recent_calls/filter/users'] || [])
        .filter((e) => {
          return e?.project?.id === this.projectId
        })
    }

    return this.$store.getters['statistics/recent_calls/filter/users']
  }

  /** Группы пользователей */
  get userGroups (): Record<string, any>[] { return this.$store.getters['statistics/recent_calls/filter/user_groups'] }

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

  /** Теги */
  get tags (): ContactTag[] {
    const tags = this.$store.getters['statistics/recent_calls/filter/tags'] as Record<string, any>[]
    return [].concat([
      {
        id: 0,
        name: this.$tc('No tags'),
        color: 'grey'
      }
    ], tags)
  }

  get timezones () {
    return this.$store.getters['statistics/recent_calls/filter/timezones']
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
    if (this.timeZoneId > 0) { this.fetchTimeZones() }

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
    this.$store.commit('statistics/recent_calls/filter/offset', 0)
  }

  /**
   * Срабатывает при поиске проектов
   * @param q
   * @private
   */
  private onAppAutocompleteProjectsSearch (q = '') {
    if (this.projects.findIndex((e: any) => e.name?.toLowerCase().indexOf(q?.toLowerCase()) > -1) === -1) {
      this.$store.dispatch('statistics/recent_calls/filter/fetchProjects', {
        q
      })
    }
  }

  private onAppAutocompleteProjectsSearchFocus () {
    if (this.projects.length === 0) { this.$store.dispatch('statistics/recent_calls/filter/fetchProjects', {}) }
  }

  private onAppAutocompleteStatusesSearch (q = '') {
    if (this.projects.findIndex((e: any) => e.name?.toLowerCase().indexOf(q?.toLowerCase()) > -1) === -1) {
      this.statusesLoading = true
      this.$store.dispatch('statistics/recent_calls/filter/fetchStatuses', {
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
      this.$store.dispatch('statistics/recent_calls/filter/fetchStatuses', params)
        .finally(() => (this.statusesLoading = false))
    }
  }

  private onAppAutocompleteStatusesClose (id: number) {
    this.$store.commit('statistics/recent_calls/filter/offset', 0)
    this.statusIds = this.statusIds.filter((value) => {
      return value !== id
    })
  }

  private onAppAutocompleteUserGroupsFocus () {
    if (this.userGroups.length === 0) { this.$store.dispatch('statistics/recent_calls/filter/fetchUserGroups', {}) }
  }

  private onSearchUsersGroups (q = '') {
    if (this.userGroups.findIndex((e: any) => e.name?.toLowerCase().indexOf(q?.toLowerCase()) > -1) === -1) {
      this.userGroupsLoading = true
      this.$store.dispatch('statistics/recent_calls/filter/fetchUserGroups', {
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
      this.$store.dispatch('statistics/recent_calls/filter/fetchUsers', params)
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
      this.$store.dispatch('statistics/recent_calls/filter/fetchUsers', params)
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
    const fetch = this
      .tags
      .findIndex((e) => e.name
        .toLowerCase()
        .indexOf((q || '')
          .toLowerCase()) > -1) === -1 || this.tags.length === 0

    if (fetch) {
      this.tagsLoading = true
      this.$store.dispatch('statistics/recent_calls/filter/fetchTags', params)
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

  private fetchTimeZones () {
    if (this.timezones.length === 0) {
      this.$store.dispatch('statistics/recent_calls/filter/fetchTimeZones')
    }
  }
  // endregion
}
</script>

<style scoped>
.extra-small-chip >>> span > button {
  font-size: 13px !important;
}
</style>

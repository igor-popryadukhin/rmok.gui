<template>
  <v-sheet min-width="850">
    <div class="d-flex align-center my-1">
      <div>
        <app-btn-toggle-date
          v-model="filterPlannedFor"
          :items="dateRangeCollection"
        >
          <template #btn="{ item }">
            {{ $tc(item.title) }}
            <template v-if="item.badge">
              <v-badge
                v-show="item.badge.visible"
                v-bind="item.badge"
                inline
              />
            </template>
          </template>
        </app-btn-toggle-date>
      </div>

      <v-divider
        class="mx-2"
        vertical
      />
      <app-status-select
        v-model="filterStatusId"
        style="max-width: 300px;"
      />
      <v-spacer />
      <div />
    </div>

    <v-divider />

    <v-row>
      <v-col>
        <template v-if="tasks.length === 0 && tasksLoadingProcess === true">
          <div class="d-flex justify-center">
            <div class="pa-16 grey--text">
              <app-loading />
            </div>
          </div>
        </template>
        <template v-else-if="tasks.length === 0 && tasksLoadingProcess === false">
          <div
            class="d-flex flex-wrap align-center justify-center"
            style="height: 400px"
          >
            <div class="grey--text">
              {{ $tc('Task list is empty') }}
            </div>
          </div>
        </template>
        <template v-else>
          <v-list>
            <template v-for="(taskItem, taskIndex) in tasks">
              <v-divider
                v-if="taskIndex > 0"
                :key="`v-divider-${taskIndex}`"
              />
              <v-skeleton-loader
                v-if="tasksLoadingProcess"
                :key="`v-skeleton-loader-${taskIndex}`"
                type="list-item-three-line"
                height="79"
              />
              <v-list-item
                v-else
                :key="`v-list-item-${taskIndex}`"
                link
                exact
                @click="onBtnTaskItemClick(taskItem)"
              >
                <v-list-item-content>
                  <v-list-item-title
                    :style="{ color: taskItem.expired ? 'red' : '' }"
                  >
                    {{ `Позвонить ${$moment.unix(taskItem.planned_for).format(`Do MMMM, dddd, ${date_time_format.long_time} a`)}` }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="taskItem.contact">
                    {{ taskItem.contact.last_name }} {{ taskItem.contact.first_name }} {{ taskItem.contact.middle_name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-if="taskItem.contact"
                  >
                    <template v-if="taskItem.contact.last_status">
                      <v-chip
                        :color="taskItem.contact.last_status.color"
                        class="mr-2"
                        label
                        outlined
                        x-small
                        @click.stop="onBtnTaskItemStatusChipClick(taskItem.contact.last_status.id)"
                      >
                        {{ taskItem.contact.last_status.name }}
                      </v-chip>
                      <span>
                        {{ taskItem.description }}
                      </span>
                    </template>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    :loading="tasksCloseProcessIds.indexOf(taskItem.id) > -1"
                    text
                    small
                    tile
                    @click.stop="onBtnTaskItemCloseClick(taskItem.id)"
                  >
                    {{ $tc('Close') }}
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </template>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import Task from '@/api/interfaces/Task'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import Tasks from '@/api/Tasks'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppStatusSelect from '@/components/AppStatusSelect/AppStatusSelect.vue'
import { makeUnixUTCTimestampRangeString } from '@/utils/datetime'
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'

const fetchTasks = debounce((params = {}, callable: any) => {
  return new Tasks().find(params).then(callable)
}, 350)

export default Vue.extend({
  components: { AppStatusSelect, AppLoading, AppBtnToggleDate },

  data () {
    return {
      tasksCloseProcessIds: [] as number[],
      tasksLoadingProcess: false,
      tasks: [] as Task[],
      tasksCounts: [] as any[]
    }
  },

  computed: {
    // Период выборки данных
    filterPlannedFor: {
      get () {
        return this.$route.query?.planned_for
      },

      set (value: string) {
        if (value) {
          this.$routerQuery.setQuery({
            planned_for: value
          })
        } else {
          this.$routerQuery.removeQuery(['planned_for'])
        }
      }
    },

    filterStatusId: {
      get () {
        return +this.$route.query?.status_id || 0
      },

      set (value: number) {
        if (value) {
          this.$routerQuery.setQuery({
            status_id: value
          })
        } else {
          this.$routerQuery.removeQuery(['status_id'])
        }
      }
    },

    dateRangeCollection () {
      return [
        {
          id: 'for_tomorrow',
          title: 'For tomorrow',
          value: makeUnixUTCTimestampRangeString('add', 1, 'day'),
          badge: this.badgeFactory('for_tomorrow')
        },
        {
          id: 'for_today',
          title: 'For today',
          value: makeUnixUTCTimestampRangeString(),
          badge: this.badgeFactory('for_today')
        },
        {
          id: 'yesterdays',
          title: 'Yesterday\'s',
          value: makeUnixUTCTimestampRangeString('subtract', 1, 'day'),
          badge: this.badgeFactory('yesterdays')
        },
        {
          id: 'the_day_before_yesterday',
          title: 'The day before yesterday',
          value: makeUnixUTCTimestampRangeString('subtract', 2, 'day'),
          badge: this.badgeFactory('the_day_before_yesterday')
        },
        {
          title: 'All',
          value: null
        }
      ]
    }
  },

  mounted () {
    if (this.filterPlannedFor) {
      this.fetchTasks()
    }

    this.calculateTaskCount()

    this.initializeWatchForFilters()
  },

  methods: {
    fetchTasks () {
      const params: any = {}

      if (this.filterPlannedFor) {
        params.planned_for = this.filterPlannedFor
      }

      if (this.filterStatusId) {
        params.status_id = this.filterStatusId
      }

      this.tasksLoadingProcess = true
      fetchTasks(params, (response: ResponseInterface<{ count: number }, Task[]>) => {
        this.tasks = response.data || []
        this.tasksLoadingProcess = false
      })
    },

    initializeWatchForFilters () {
      this.$watch('filterPlannedFor', () => (this.fetchTasks()))
      this.$watch('filterStatusId', () => {
        this.fetchTasks()
        this.calculateTaskCount()
      })
    },

    onBtnTaskItemCloseClick (id: number) {
      this.tasksCloseProcessIds.push(id)
      new Tasks()
        .setState(id, 'done')
        .then(() => {
          this.$toast.success('The task is closed')
          const taskIndex = this.tasks.findIndex((e) => e.id === id)
          if (taskIndex > -1) {
            this.tasks.splice(taskIndex, 1)
          }

          this.calculateTaskCount()
        }).finally(() => {
          const taskIndex = this.tasksCloseProcessIds.indexOf(id)
          if (taskIndex > -1) {
            this.tasksCloseProcessIds.splice(taskIndex)
          }
        })
    },

    onBtnTaskItemClick (item: Task) {
      if (item.contact) {
        this.$router.push({
          name: 'contacts_view',
          params: {
            contact_id: String(item.contact.id)
          }
        })
      }
    },

    onBtnTaskItemStatusChipClick (statusId: number) {
      this.filterStatusId = statusId
    },

    calculateTaskCount () {
      new Tasks()
        .calculateCount(this.dateRangeCollection
          .filter((e) => e.id && e.value)
          .map((e) => {
            const params: any = {
              planned_for: e.value
            }

            if (this.filterStatusId) {
              params.status_id = this.filterStatusId
            }

            return {
              id: e.id,
              params
            }
          })
        ).then((response) => {
          this.tasksCounts = response
        })
    },

    badgeFactory (id: string) {
      const foundIndex = this.tasksCounts.findIndex((e) => e.id === id)
      if (foundIndex > -1) {
        const found = this.tasksCounts[foundIndex]
        return {
          content: found.count > 99 ? '99+' : found.count,
          visible: found.count > 0,
          color: 'red'
        }
      }

      return null
    }
  }
})
</script>

<style lang="scss" scoped>
.task-toolbar {
  flex: none !important;
  box-shadow: none !important;

  &-extension {
    display: flex;
    flex-flow: column;
  }

  &-extension small {
    font-size: 12px;
    color: #848484;
  }
}
</style>

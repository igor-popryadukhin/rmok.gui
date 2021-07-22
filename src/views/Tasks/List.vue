<template>
  <v-sheet>
    <app-btn-toggle-date
      v-model="filterPlannedFor"
      :items="dateRangeCollection"
    >
      <template #btn="{ item }">
        {{ $tc(item.title) }}
      </template>
    </app-btn-toggle-date>

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
              >
                <v-list-item-content>
                  <v-list-item-title
                    :style="{ color: taskItem.expired ? 'red' : '' }"
                  >
                    {{ `Позвонить ${$moment.unix(taskItem.planned_for).format(`Do MMMM, dddd, ${date_time_format.long_time} a`)}` }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="taskItem.contact">
                    {{ taskItem.contact.last_name }} {{ taskItem.contact.first_name }} {{
                      taskItem.contact.middle_name
                    }}
                  </v-list-item-subtitle>
                  <!--                    <v-list-item-subtitle>-->
                  <!--                      <span-->
                  <!--                        class="label mr-2"-->
                  <!--                      >-->
                  <!--                        {{ lastContactStatus(taskItem.contact).name }}-->
                  <!--                      </span> {{ taskItem.description || '—' }}-->
                  <!--                    </v-list-item-subtitle>-->
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu
                    bottom
                    left
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list dense>
                      <v-list-item
                        v-for="(itemAction, i) in itemActions"
                        :key="i"
                        v-bind="itemAction.attrs"
                        @click="itemAction.click(taskItem)"
                      >
                        <v-list-item-title>{{ itemAction.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
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
import moment from 'moment'
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'

const fetchTasks = debounce((params = {}, callable: any) => {
  return new Tasks().find(params).then(callable)
}, 350)

export default Vue.extend({
  components: { AppLoading, AppBtnToggleDate },

  data () {
    return {
      tasksLoadingProcess: false,
      tasks: [] as Task[]
    }
  },

  computed: {
    // Период выборки данных
    filterPlannedFor: {
      get () {
        return this.$route.query?.period
      },

      set (value: string) {
        if (value) {
          this.$routerQuery.setQuery({
            period: value
          })
        } else {
          this.$routerQuery.removeQuery(['planned_for'])
        }
      }
    },

    dateRangeCollection () {
      return [
        {
          title: 'For tomorrow',
          value: `${moment('00:00:00', 'hh:mm:ss').unix()},${moment('23:59:59', 'hh:mm:ss').unix()}`
        },
        {
          title: 'For today',
          value: `${moment('00:00:00', 'hh:mm:ss').subtract(1, 'day').unix()},${moment('23:59:59', 'hh:mm:ss').subtract(1, 'day').unix()}`
        },
        {
          title: 'Yesterday\'s',
          value: `${moment('23:59:59', 'hh:mm:ss').subtract(7, 'day').unix()},${moment('00:00:00', 'hh:mm:ss').unix()}`
        },
        {
          title: 'The day before yesterday',
          value: `${moment('00:00:00', 'hh:mm:ss').subtract(14, 'day').unix()},${moment('23:59:59', 'hh:mm:ss').subtract(7, 'day').unix()}`
        },
        {
          title: 'All',
          value: null
        }
      ]
    }
  },

  mounted () {
    this.initializeWatchForFilters()
  },

  methods: {
    fetchTasks () {
      const params: any = {}

      if (this.filterPlannedFor) {
        params.planned_for = this.filterPlannedFor
      }

      this.tasksLoadingProcess = true
      fetchTasks(params, (response: ResponseInterface<{ count: number }, Task[]>) => {
        this.tasks = response.data || []
        this.tasksLoadingProcess = false
      })
    },

    initializeWatchForFilters () {
      this.$watch('filterPlannedFor', () => (this.fetchTasks()))
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

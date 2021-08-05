<template>
  <v-sheet class="mb-16">
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
          <v-list-item
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
                v-if="taskItem.state === 'pending'"
                :loading="tasksActionProcessIds.indexOf(taskItem.id) > -1"
                text
                small
                tile
                @click.stop="onBtnTaskItemCloseClick(taskItem.id)"
              >
                {{ $tc('Close') }}
              </v-btn>
              <v-btn
                v-else-if="taskItem.state === 'done'"
                :loading="tasksActionProcessIds.indexOf(taskItem.id) > -1"
                text
                small
                tile
                @click.stop="onBtnTaskItemReopenClick(taskItem.id)"
              >
                {{ $tc('Reopen') }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
      <v-btn
        v-if="loadMoreVisible && tasksCount >= 10"
        :loading="loadMoreProcess"
        block
        text
        tile
        @click="onBtnLoadMoreClick"
      >
        {{ $tc('Load more') }}
      </v-btn>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Task from '@/api/interfaces/Task'
import Tasks from '@/api/Tasks'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Vue from 'vue'

export default Vue.extend({
  components: { AppLoading },

  props: {
    params: {
      type: Object,
      default: () => null
    }
  },

  data () {
    return {
      loadMoreVisible: false,
      loadMoreProcess: false,
      tasksActionProcessIds: [] as number[],
      tasksLoadingProcess: false,
      tasks: [] as Task[],
      tasksOffset: 0,
      tasksCount: 0
    }
  },

  mounted () {
    if (this.params) { this.fetchTasks(this.params) }
  },

  methods: {
    fetchTasks (params: Record<string, string | number> = {}) {
      this.tasksLoadingProcess = true

      if (!('count' in params)) {
        params.count = 10
      }

      new Tasks()
        .find(params)
        .then((response) => {
          this.$data.tasksCount = response.meta?.count || 0

          if (this.$data.tasksOffset > 0) {
            if ((response.data || []).length === 0) {
              this.$data.loadMoreVisible = false
            }
            // Слияние
            this.$data.tasks = this.$data.tasks.concat(response.data || [])
          } else {
            this.$data.tasks = response.data || []
            if (Array(response.data || []).length > 0) {
              this.$data.loadMoreVisible = true
            }
          }
        }).finally(() => {
          this.loadMoreProcess = false
          this.tasksLoadingProcess = false
        })
    },

    onBtnLoadMoreClick () {
      this.loadMoreProcess = true
      this.$data.tasksOffset = this.$data.tasksOffset + 10
      this.fetchTasks(Object.assign(this.params, { offset: this.$data.tasksOffset }))
    },

    /**
     * Событие происходит когда нажали на кнопку "закрыть задачу"
     * @param id
     */
    onBtnTaskItemCloseClick (id: number) {
      this.tasksActionProcessIds.push(id)
      new Tasks()
        .setState(id, 'done')
        .then(() => {
          this.$toast.success('The task is closed')
          this.$emit('update:task-closed')
          const taskIndex = this.tasks.findIndex((e) => e.id === id)
          if (taskIndex > -1) {
            this.tasks.splice(taskIndex, 1)
          }
        }).finally(() => {
          const taskIndex = this.tasksActionProcessIds.indexOf(id)
          if (taskIndex > -1) {
            this.tasksActionProcessIds.splice(taskIndex)
          }
        })
    },

    onBtnTaskItemReopenClick (id: number) {
      this.tasksActionProcessIds.push(id)
      new Tasks()
        .setState(id, 'pending')
        .then(() => {
          this.$toast.success('The task is reopened')
          this.$emit('update:task-reopened')
        }).finally(() => {
          const taskIndex = this.tasksActionProcessIds.indexOf(id)
          if (taskIndex > -1) {
            this.tasksActionProcessIds.splice(taskIndex)
          }
        })
    },
    /**
     * Событие происходит когда нажали на элемент списка задач.
     * @param item Объект задачи.
     */
    onBtnTaskItemClick (item: Task) {
      // Перехожу на страницу взаимодействия с контактом.
      if (item.contact) {
        this.$router.push({
          name: 'contacts_view',
          params: {
            contact_id: String(item.contact.id)
          }
        })
      } else {
        this.$toast.warning('The task does not own the contact.')
      }
    },

    /**
     * Событие происходит когда нажали на элемент статуса списка задач.
     * @param status_id Идентификатор статуса.
     */
    onBtnTaskItemStatusChipClick (status_id: number) {
      // Устанавливаю параметры маршрута.
      this.$routerQuery.setQuery({
        status_id
      })
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

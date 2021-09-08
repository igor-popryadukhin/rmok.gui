<template>
  <v-sheet>
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
          >
            <v-list-item-content>
              <v-list-item-title
                :style="{ color: taskItem.expired ? 'red' : '' }"
              >
                {{ `${taskTypeDisplay(taskItem.type)} ${$dayjs(taskItem.planned_for * 1000).format(`DD MMMM, в dddd, в ${date_time_format.long_time} a`)}` }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="taskItem.contact">
                {{ taskItem.contact.last_name }} {{ taskItem.contact.first_name }} {{ taskItem.contact.middle_name }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <template v-if="taskItem.contact">
                  <template v-if="taskItem.contact.status">
                    <v-chip
                      :color="taskItem.contact.status.color"
                      class="mr-2"
                      label
                      outlined
                      x-small
                    >
                      {{ taskItem.contact.status.name }}
                    </v-chip>
                  </template>
                  <span>
                    {{ taskItem.description }}
                  </span>
                </template>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text v-if="taskItem.author">
                {{ $t('author_name', { name: taskItem.author.first_name + ' ' + taskItem.author.last_name }) }}
              </v-list-item-action-text>
              <div class="d-inline-flex">
                <v-btn
                  :loading="tasksEditProcessIds.indexOf(taskItem.id) > -1"
                  text
                  small
                  tile
                  @click.stop="onBtnTaskItemEditClick(taskItem.id)"
                >
                  {{ $tc('Change') }}
                </v-btn>
                <v-btn
                  :loading="tasksCloseProcessIds.indexOf(taskItem.id) > -1"
                  text
                  small
                  tile
                  @click.stop="onBtnTaskItemCloseClick(taskItem.id)"
                >
                  {{ $tc('Close') }}
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </template>

    <!-- Диалог редактирования задач -->
    <template v-if="taskDialogEditVisible">
      <app-task-dialog-edit
        v-model="taskDialogEditVisible"
        :time="taskDialogEdit.time"
        :date="taskDialogEdit.date"
        :type="taskDialogEdit.type"
        :description="taskDialogEdit.description"
        @update="onTaskDialogEdit"
      />
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Task from '@/api/interfaces/Task'
import Tasks from '@/api/Tasks'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'

export default Vue.extend({
  components: {
    AppTaskDialogEdit: () => import('@/components/AppTaskDialogEdit/AppTaskDialogEdit.vue'),
    AppLoading
  },

  data () {
    return {
      tasksEditProcessIds: [] as number[],
      tasksCloseProcessIds: [] as number[],
      tasksLoadingProcess: false,
      tasks: [] as Task[],
      taskDialogEditVisible: false,
      taskDialogEdit: {
        id: 0,
        time: '',
        date: '',
        type: '',
        description: ''
      }
    }
  },

  computed: {
    contactId () {
      return +this.$route.params.contact_id
    }
  },

  created () {
    this.onSSETasksChanged = debounce(this.onSSETasksChanged, 1000)
    this.$root.$on('sse-tasks-changed', this.onSSETasksChanged)
  },

  mounted () {
    this.fetchTasks()
  },

  beforeDestroy () {
    this.$root.$off('sse-tasks-changed', this.onSSETasksChanged)
  },

  methods: {
    fetchTasks () {
      this.tasksLoadingProcess = true
      new Tasks()
        .find({
          contact_id: this.contactId
        })
        .then((response) => {
          this.$data.tasks = response.data || []
        }).finally(() => (this.tasksLoadingProcess = false))
    },

    taskTypeDisplay (type: string) {
      switch (type) {
        case 'call': return 'Позвонить'
        case 'task': return 'Задача'
        case 'letter': return 'Написать письмо'
        case 'meeting': return 'Встреча'
        default: return ''
      }
    },

    onBtnTaskItemEditClick (task_id: number) {
      this.tasksEditProcessIds.push(task_id)
      new Tasks()
        .getById(task_id)
        .then((response) => {
          this.taskDialogEditVisible = true

          this.taskDialogEdit.id = response.id
          this.taskDialogEdit.time = this.$dayjs(response.planned_for * 1000).format('HH:mm')
          this.taskDialogEdit.date = this.$dayjs(response.planned_for * 1000).format('YYYY-MM-DD')
          this.taskDialogEdit.type = response.type
          this.taskDialogEdit.description = response.description

          this.$appDebug(this.taskDialogEdit)
        }).finally(() => {
          const index = this.tasksEditProcessIds.findIndex(e => e === task_id)
          if (index > -1) {
            this.tasksEditProcessIds.splice(index, 1)
          }
        })
    },

    /**
     * Редактирование задачи.
     */
    onTaskDialogEdit (data: unknown & { date: string; time: string; type: string; description: string }) {
      new Tasks()
        .edit(this.taskDialogEdit.id, {
          contact_id: this.contactId,
          type: data.type,
          planned_for: this.$dayjs(`${data.date} ${data.time}`, 'YYYY-MM-DD hh:mm').utc().unix(),
          description: data.description
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
        }).finally(() => {
          const taskIndex = this.tasksCloseProcessIds.indexOf(id)
          if (taskIndex > -1) {
            this.tasksCloseProcessIds.splice(taskIndex)
          }
        })
    },

    onSSETasksChanged () {
      this.fetchTasks()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

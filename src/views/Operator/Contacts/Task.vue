<template>
  <div>
    <v-row no-gutters>
      <v-col class="pa-0">
        <v-toolbar
          flat
        >
          <v-spacer />
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                icon
                v-on="on"
                v-bind="attrs"
                @click="onTaskAddClick"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('Add new task') }}</span>
          </v-tooltip>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-list>
          <template v-if="tasks.length > 0">
            <template v-for="(task, taskIndex) in tasks">
              <v-divider
                :key="`v-divider-${taskIndex}`"
              />
              <v-list-item
                :key="`v-list-item-${taskIndex}`"
                link
                three-line
                exact
                :style="task.done ? {'text-decoration': 'line-through'} : ''"
              >
                <v-list-item-avatar>
                  <v-avatar>
                    <v-icon v-if="task.type === 'call'">mdi-alpha-c-circle</v-icon>
                    <v-icon v-if="task.type === 'task'">mdi-alpha-t-circle</v-icon>
                    <v-icon v-if="task.type === 'meeting'">mdi-alpha-m-circle</v-icon>
                    <v-icon v-if="task.type === 'letter'">mdi-alpha-e-circle</v-icon>
                    <v-icon v-if="task.type === 'other'">mdi-alpha-o-circle</v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-if="task.type === 'call'">{{ $t('Call') }}</v-list-item-title>
                  <v-list-item-title v-if="task.type === 'task'">{{ $t('Task') }}</v-list-item-title>
                  <v-list-item-title v-if="task.type === 'meeting'">{{ $t('Meeting') }}</v-list-item-title>
                  <v-list-item-title v-if="task.type === 'letter'">{{ $t('Letter') }}</v-list-item-title>
                  <v-list-item-title v-if="task.type === 'other'">{{ $t('Other') }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ task.description }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Выполнить до {{ new Date(task.planned_for * 1000).toLocaleString() }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer />
                <v-list-item-content>
                  <v-list-item-title>Автор</v-list-item-title>
                  <v-list-item-subtitle v-if="$store.getters['profile/id'] === task.author.id">Вы</v-list-item-subtitle>
                  <v-list-item-subtitle v-else>{{ task.author.first_name }} {{ task.author.last_name }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ new Date(task.created_at * 1000).toLocaleString() }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        large
                        v-bind="attrs"
                        v-on.stop="on"
                      >
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-if="task.done"
                        link
                        @click="onTaskItemActionTaskNotDoneClick(task.id)"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-check-bold</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Отменить выполнение</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        v-else
                        link
                        @click="onTaskItemActionTaskDoneClick(task.id)"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-check-bold</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Выполнить</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </template>
          </template>
          <template v-else-if="tasks.length === 0 && tasksLoading  === true">
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">{{ $tc('Loading content...') }}</span>
              <v-spacer />
            </v-list-item>
          </template>
          <template v-else-if="history.length === 0 && tasksLoading === false">
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">У вас нет задач</span>
              <v-spacer />
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import breadcrumbs from '@/mixins/breadcrumbs'
import DTask from '@/components/Dialogs/DTask.vue'
import rules from '@/mixins/rules'
import Tasks, { TaskGetResponseInterface, TaskInterface, TaskPostDataInterface, TaskType } from '@/api/Tasks'

export default Vue.extend({
  mixins: [breadcrumbs, rules],

  data () {
    return {
      tasksLoading: false,
      tasks: [] as TaskInterface[]
    }
  },

  created () {
    this.loadTasks()
  },

  methods: {
    onTaskItemActionTaskDoneClick (taskId: number) {
      new Tasks()
        .done(taskId)
        .then(() => {
          const taskIndex = this.tasks.findIndex((e: TaskInterface) => e.id === taskId)
          if (taskIndex > -1) {
            this.tasks[taskIndex].done = true
            this.tasks.sort((a: TaskInterface) => {
              return a.done ? 0 : -1
            })
            this.$root.$emit('root-update-notifications')
          }
        })
    },

    onTaskItemActionTaskNotDoneClick (taskId: number) {
      new Tasks()
        .notDone(taskId)
        .then(() => {
          const taskIndex = this.tasks.findIndex((e: TaskInterface) => e.id === taskId)
          if (taskIndex > -1) {
            this.tasks[taskIndex].done = false
            this.tasks.sort((a: TaskInterface) => {
              return a.done ? 0 : -1
            })
            this.$root.$emit('root-update-notifications')
          }
        })
    },

    onTaskAddClick () {
      this.$dialog.show(DTask, {
        waitForResult: true,
        title: this.$t('Create a new task'),
        saveTitle: this.$t('Save'),
        cancelTitle: this.$t('Cancel'),
        date: {
          label: this.$tc('Date'),
          rules: [this.rules.notBlank]
        },
        time: {
          label: this.$tc('Time'),
          rules: [this.rules.notBlank]
        },
        comment: {
          label: this.$tc('Comment'),
          rules: [this.rules.notBlank]
        },
        types: {
          label: this.$tc('Task type'),
          itemText: 'title',
          itemValue: 'value',
          rules: [this.rules.notBlank],
          items: [
            {
              title: this.$tc('Call'),
              value: 'call'
            },
            {
              title: this.$tc('Task'),
              value: 'task'
            },
            {
              title: this.$tc('Meeting'),
              value: 'meeting'
            },
            {
              title: this.$tc('Letter'),
              value: 'letter'
            },
            {
              title: this.$tc('Other'),
              value: 'other'
            }
          ]
        },
        performers: {
          label: this.$tc('Performer'),
          itemText: 'title',
          itemValue: 'value',
          disabled: true,
          placeholder: 'Вы',
          rules: []
        },
        automaticExecution: {
          label: this.$tc('Automatically complete the task after the call'),
          value: false
        },
        width: this.$vuetify.breakpoint.name === 'sm' ? '100%' : '60%',
        persistent: true,
        onSave: (data: TaskPostDataInterface) => {
          const taskData: TaskPostDataInterface = {
            description: data.description,
            planned_for: Date.parse(`${data.date} ${data.time}`) / 1000,
            type: data.type.value
          }

          if (data.type.value === TaskType.CALL) {
            taskData.contact_id = +this.$route.params.contact_id
          }
          new Tasks()
            .add(taskData).finally(this.loadTasks)
        }
      })
    },

    loadTasks () {
      this.tasksLoading = true
      new Tasks()
        .get()
        .then((response: TaskGetResponseInterface) => {
          this.tasks = response.items
        }).finally(() => {
          this.tasksLoading = false
          this.$root.$emit('root-update-notifications')
        })
    }
  }
})
</script>

<style scoped>

</style>

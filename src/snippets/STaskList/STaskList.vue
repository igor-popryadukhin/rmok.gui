<template>
  <v-card
    :tile="tile"
    :flat="flat"
    :outlined="outlined"
    :height="height"
  >

    <!-- Tool bar -->
    <v-toolbar
      extended
      height="48"
      class="task-toolbar"
    >
      <v-toolbar-title>{{ $tc('Tasks') }}</v-toolbar-title>

      <v-spacer />

      <v-btn
        @click="onTaskAddClick"
        text
        tile
      >
        {{ $tc('Add task') }}
      </v-btn>
      <template v-slot:extension>
        <div class="task-toolbar-extension">
          <small>Всего: {{ totalTasks }}</small>
          <small>Просроченные: {{ overdueTasks }}</small>
        </div>
      </template>
    </v-toolbar>
    <!-- Tool bar -->

    <v-container
      class="pa-0 flex-grow-1 overflow-y-auto"
      fluid
    >
      <template v-if="tasks.length === 0 && tasksLoading  === true">
        <div
          class="d-flex align-center justify-center"
        >
          <div class="grey--text">{{ $tc('Loading content...') }}</div>
        </div>
      </template>
      <template v-if="tasks.length === 0 && tasksLoading  === false">
        <div
          class="d-flex align-center justify-center"
        >
          <div class="grey--text">{{ $tc('Task list is empty') }}</div>
        </div>
      </template>
      <template v-if="tasks.length > 0">
        <v-list>
          <template v-for="(task, taskIndex) in tasks">
            <v-divider
              :key="`v-divider-${taskIndex}`"
            />

            <v-skeleton-loader
              v-if="tasksLoading"
              type="list-item-avatar-two-line"
              :key="`v-skeleton-loader-${taskIndex}`"
            />
            <v-list-item
              v-else
              :key="`v-list-item-${taskIndex}`"
              :style="vListItemStyleComputed(task)"
              link
              exact
              @click.stop="onTaskItemClick(task)"
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
                <v-list-item-title v-if="task.type === 'call'">
                  {{ `Позвонить ${$moment.utc(task.planned).local().format('Do MMMM, dddd, hh:mm:ss a')}` }}
                </v-list-item-title>
                <v-list-item-title v-if="task.type === 'task'">{{ $t('Task') }}</v-list-item-title>
                <v-list-item-title v-if="task.type === 'meeting'">{{ $t('Meeting') }}</v-list-item-title>
                <v-list-item-title v-if="task.type === 'letter'">{{ $t('Letter') }}</v-list-item-title>
                <v-list-item-title v-if="task.type === 'other'">{{ $t('Other') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ task.description || '—' }}
                </v-list-item-subtitle>
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
                  <v-list class="py-0" dense>

                    <!-- Выполнить/отменить выполнение задачу(чи) -->
                    <v-list-item
                      v-if="task.done"
                      link
                      @click="onTaskItemActionTaskNotDoneClick(task.id)"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-checkbox-blank-outline</v-icon>
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
                        <v-icon>mdi-check-box-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Выполнить</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <!-- Выполнить/отменить выполнение задачу(чи) -->

                    <!-- Редактировать задачу -->
                    <v-list-item
                      link
                      @click="onTaskItemEditClick(task.id)"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-notebook-edit-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ $tc('Edit') }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <!-- Редактировать задачу -->

                    <!-- Удалить задачу -->
                    <v-list-item
                      link
                      @click="onTaskItemDeleteClick(task.id)"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ $tc('Delete') }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <!-- Удалить задачу -->
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </template>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import rules from '@/mixins/rules'
import Tasks, { TaskInterface } from '@/api/Tasks'
import VInterface from '@/VInterface'
import STaskDialogEditor from './STaskDialogEditor.vue'
import APIError from '@/api/classes/APIError'

interface IRef {
  [key: string]: any;
}

interface IData {
  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $data: IData;
  $refs: IRef;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  props: {
    outlined: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    tile: {
      type: Boolean,
      default: false
    },
    height: {
      type: [String, Number],
      default: () => undefined
    }
  },

  mixins: [rules],

  data () {
    return {
      tasksLoading: false,
      totalTasks: 0,
      overdueTasks: 0,
      tasks: [] as TaskInterface[]
    }
  },

  computed: {
    vContainerHeight (): number {
      return 100 + (this.tasks.length * 88)
    }
  },

  created () {
    this.$root.$on('root-update-notifications', this.fetchData)
  },

  destroyed () {
    this.$root.$off('root-update-notifications', this.fetchData)
  },

  methods: {
    vListItemStyleComputed (task: TaskInterface) {
      const style: any = {}

      if (task.done) {
        style['text-decoration'] = 'line-through'
      } else if (task.expired) {
        style['background-color'] = '#ff000024'
      }

      return style
    },

    onTaskItemClick (item: TaskInterface) {
      if (item.contact) {
        this.$router.push({
          name: 'operator_leads_tasks',
          params: { contact_id: item.contact.id } as any,
          query: { task_id: String(item.id) }
        })
      }
    },

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

    onTaskItemEditClick (id: number) {
      new Tasks()
        .getById(id)
        .then((response) => {
          const plannedFor = new Date(response.planned_for * 1000)
          this.$dialog.show(STaskDialogEditor, {
            waitForResult: true,
            width: ['xs', 'sm'].includes(this.$vuetify.breakpoint.name) ? '100%' : '45%',
            persistent: true,
            performerId: response.performer.id,
            contactId: response.contact?.id,
            type: response.type,
            date: plannedFor.toISOString().substr(0, 10),
            time: plannedFor.toTimeString().substr(0, 5),
            description: response.description,
            responsibleDisabled: true,
            onSave: (data: any) => {
              const taskData: any = {
                performer_id: data.performer_id,
                description: data.description,
                planned_for: Date.parse(`${data.date} ${data.time}`) / 1000,
                type: data.type,
                contact_id: response.contact?.id
              }

              new Tasks()
                .edit(id, taskData)
                .then(() => {
                  this.$toast.success(this.$tc('Task successfully updated'))
                })
                .catch((e: APIError) => {
                  let text = ''
                  if (this.assertObjectHasAttribute(e, 'errors')) {
                    text = e.errors.map(e => e.message).join('\n')
                  }
                  this.$toast.error(`${e.message}\n${text}`)
                })
                .finally(() => {
                  this.$root.$emit('root-update-notifications') // Генерирую глобальное событие, для обновления уведомлений
                })
            }
          })
        })
    },

    onTaskItemDeleteClick (id: number) {
      this.$dialog.confirm({
        title: this.$tc('Deleting task'),
        text: this.$tc('All information about the task, the history of interaction will be deleted permanently.'),
        actions: {
          false: {
            color: 'red',
            outlined: true,
            flat: true,
            tile: true,
            text: this.$tc('no')
          },
          true: {
            text: this.$tc('yes'),
            handle: () => {
              return new Promise<void>((resolve) => {
                new Tasks()
                  .delete(id)
                  .then(() => {
                    this.$toast.success(this.$tc('Task successfully deleted'))
                    this.$root.$emit('root-update-notifications')
                  }).catch((e: APIError) => {
                    this.$toast.error(e.message)
                  })
                resolve()
              })
            }
          }
        }
      })
    },

    onTaskAddClick () {
      this.$dialog.show(STaskDialogEditor, {
        waitForResult: true,
        width: ['xs', 'sm'].includes(this.$vuetify.breakpoint.name) ? '100%' : '45%',
        persistent: true,
        performerId: this.$store.getters['profile/id'],
        responsibleDisabled: true,
        onSave: (data: any) => {
          const taskData: any = {
            performer_id: data.performer_id,
            description: data.description,
            planned_for: Date.parse(`${data.date} ${data.time}`) / 1000,
            type: data.type,
            contact_id: +this.$route.params.contact_id
          }

          new Tasks()
            .add<number>(taskData)
            .then(() => {
              this.$toast.success(this.$tc('Task successfully created'))
            })
            .catch((e: APIError) => {
              let text = ''
              if (this.assertObjectHasAttribute(e, 'errors')) {
                text = e.errors.map(e => e.message).join('\n')
              }
              this.$toast.error(`${e.message}\n${text}`)
            })
            .finally(() => {
              this.$root.$emit('root-update-notifications') // Генерирую глобальное событие, для обновления уведомлений
            })
        }
      })
    },

    fetchData (params = {}) {
      return new Promise<void>((resolve, reject) => {
        this.tasksLoading = true

        const newParams: any = Object.assign({}, params)

        if (this.assertObjectHasAttribute(this.$route.params, 'contact_id')) {
          if (!this.assertObjectHasAttribute(newParams, 'contact_id')) {
            newParams.contact_id = this.$route.params.contact_id
          }
        }

        new Tasks()
          .find<{ count: number; overdue_tasks: number }, TaskInterface[]>(newParams)
          .then((response) => {
            resolve()
            this.overdueTasks = Number(response.meta.overdue_tasks)
            this.totalTasks = Number(response.meta.count)
            this.tasks = response.data as TaskInterface[]
          }).finally(() => {
            this.tasksLoading = false
          }).catch(reject)
      })
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

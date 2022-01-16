<template>
  <v-sheet
    class="task-list"
    height="100%"
  >
    <template v-if="items.length === 0 && itemsFetching">
      <div class="d-flex justify-center align-center fill-height">
        <div class="grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else-if="items.length === 0 && itemsFetching === false">
      <div class="d-flex align-center justify-center fill-height">
        <div class="grey--text">
          {{ $tc('Task list is empty') }}
        </div>
      </div>
    </template>
    <template v-else>
      <v-list>
        <template v-for="(taskItem, taskIndex) in items">
          <v-divider
            v-if="taskIndex > 0"
            :key="`v-divider-${taskIndex}`"
          />
          <v-list-item
            :key="`v-list-item-${taskIndex}`"
            link
            exact
            @click="onListItemClick(taskItem.id)"
          >
            <v-list-item-content>
              <v-list-item-title
                :style="{ color: taskItem.expired ? 'red' : '' }"
              >
                {{ `${taskTypeDisplay(taskItem.type)} ${$dayjs(taskItem.planned_for).format(`DD MMMM, в dddd, в HH:mm a`)}` }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <template v-if="taskItem.contact">
                  {{ taskItem.contact.full_name }}
                </template>
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
              <div class="d-inline-flex">
                <v-btn
                  :loading="tasksCloseProcessIds.indexOf(taskItem.id) > -1"
                  small
                  icon
                  @click.stop="onBtnTaskItemCloseClick(taskItem.id)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Task from '@/api/interfaces/Task'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import debounce from '@/utils/debounce'
import TasksBase from '@/views/Tasks/TasksBase'

import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

// eslint-disable-next-line no-use-before-define
@Component<TasksList>({
  components: { AppLoading },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch(to.path.substring(1) + '/list/fetch')
    })
  },
  beforeRouteUpdate (to, from, next) {
    const isFetching = this.$store.getters[to.path.substring(1) + '/list/items_fetching']
    const isEmpty = (this.$store.getters[to.path.substring(1) + '/list/items'] || []).length === 0
    if (isEmpty && !isFetching) {
      this.$store.dispatch(to.path.substring(1) + '/list/fetch')
    }
    next()
  }
})
export default class TasksList extends TasksBase {
  tasksCloseProcessIds = []

  @Prop() readonly id!: string
  @Prop({ default: () => null }) readonly planned_for!: string|null

  /**
   * Задачи
   */
  get items (): Task[] {
    return this.$store.getters[this.vuexModuleNamespace + '/list/items'] || []
  }

  /**
   * Процесс получения задач
   */
  get itemsFetching (): boolean {
    return this.$store.getters[this.vuexModuleNamespace + '/list/items_fetching']
  }

  public created () {
    this.fetchTasks = debounce(this.fetchTasks, 3000)
    this.$root.$on('sse-tasks-changed', this.onSSETasksChanged)
  }

  public beforeDestroy () {
    this.$root.$off('sse-tasks-changed', this.onSSETasksChanged)
  }

  private onListItemClick (id: number) {
    const task = this.items.find((e) => e.contact && e.id === id)
    if (task) {
      this.$router.push({
        name: 'contacts_view_tasks',
        params: {
          id: String(task.contact.id)
        }
      })
    }
  }

  private taskTypeDisplay (type: string) {
    switch (type) {
      case 'call': return 'Позвонить'
      case 'task': return 'Задача'
      case 'letter': return 'Написать письмо'
      case 'meeting': return 'Встреча'
      default: return ''
    }
  }

  private onBtnTaskItemCloseClick (id: number) {
    this.$dialog.confirm({
      title: this.$tc('Confirmation request'),
      text: this.$tc('Are you sure you want to close the task?'),
      showClose: false,
      actions: {
        false: this.$tc('Cancel'),
        true: this.$tc('Yes')
      }
    }).then((asnwer: boolean) => {
      if (asnwer) {
        this.tasksCloseProcessIds.push(id)
        this.$axios.get(`/tasks/${id}/done`)
          .then((response) => {
            if (response.status === 200) {
              this.$toast.success('The task is closed')
            }
          }).finally(() => {
            const processId = this.tasksCloseProcessIds.findIndex((e) => e === id)
            if (processId > -1) {
              this.tasksCloseProcessIds.splice(processId, 1)
            }
          })
      }
    })
  }

  private onSSETasksChanged () {
    this.fetchTasks()
  }
}
</script>

<style lang="scss" scoped>
.task-list {}
</style>

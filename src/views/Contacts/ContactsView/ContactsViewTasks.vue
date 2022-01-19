<template>
  <v-sheet height="100%">
    <template v-if="items.length === 0 && itemsFetching === true">
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
          >
            <v-list-item-content>
              <v-list-item-title
                :style="{ color: taskItem.expired ? 'red' : '' }"
              >
                {{ `${taskTypeDisplay(taskItem.type)} ${$dayjs(taskItem.planned_for).format(`DD MMMM, в dddd, в HH:mm a`)}` }}
              </v-list-item-title>
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
                  class="mr-2"
                  small
                  icon
                  @click.stop="onBtnTaskItemEditClick(taskItem.id)"
                >
                  <v-icon>mdi-pencil-box-multiple-outline</v-icon>
                </v-btn>
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

    <app-task-dialog-edit
      v-model="taskDialogVisible"
      :dialog-title="$tc('Editing a task')"
      display-format-date="DD.MM.YYYY"
      :type.sync="taskDialog.type"
      :date-time.sync="taskDialog.dateTime"
      :description.sync="taskDialog.description"
      @action:ok:click="onBtnTaskDialogOkClick"
    />
  </v-sheet>
</template>

<script lang="ts">
import Task from '@/api/interfaces/Task'
import AppBase from '@/AppBase'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import dayjs from '@/plugins/dayjs'
import debounce from '@/utils/debounce'
import Component from 'vue-class-component'

const dateTimeFormat = 'YYYY-MM-DDTHH:mm'

// eslint-disable-next-line no-use-before-define
@Component<ContactsViewTasks>({
  components: {
    AppTaskDialogEdit: () => import('@/components/AppTaskDialogEdit/AppTaskDialogEdit.vue'),
    AppLoading
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('contacts/view/tasks/fetch', to.params.id)
    })
  }
})
export default class ContactsViewTasks extends AppBase {
  tasksCloseProcessIds = []
  tasksEditProcessIds = []
  taskDialogVisible = false
  taskDialog = {
    id: 0,
    type: 'call',
    dateTime: dayjs().format(dateTimeFormat),
    description: ''
  }

  get itemsFetching (): boolean {
    return this.$store.getters['contacts/view/tasks/items_fetching']
  }

  get items (): Task[] {
    return this.$store.getters['contacts/view/tasks/items']
  }

  public created () {
    this.$store.commit('contacts/view/tasks/items', [])
    this.$store.commit('contacts/view/tasks/items_count', 0)
    this.fetchTasks = debounce(this.fetchTasks, 1000)

    this.$root.$on('sse-tasks-changed', this.onSSETasksChanged)
  }

  public beforeDestroy () {
    this.$root.$off('sse-tasks-changed', this.onSSETasksChanged)
  }

  private onSSETasksChanged () {
    this.fetchTasks()
  }

  private fetchTasks () {
    this.$store.dispatch('contacts/view/tasks/fetch', this.$route.params.id)
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

  private onBtnTaskItemEditClick (id: number) {
    const task = this.items.find(e => e.id === id)
    if (task) {
      this.taskDialog.id = task.id
      this.taskDialog.type = task.type
      this.taskDialog.description = task.description
      this.taskDialog.dateTime = this.$dayjs(task.planned_for).format(dateTimeFormat)
      this.taskDialogVisible = true
    }
  }

  private onBtnTaskDialogOkClick () {
    this.$axios.patch(`/tasks/${this.taskDialog.id}`, {
      type: this.taskDialog.type,
      description: this.taskDialog.description,
      planned_for: this.$dayjs(this.taskDialog.dateTime, dateTimeFormat).toISOString()
    }).then((response) => {
      if (response.status === 200) {
        this.$toast.success('The task is update')
      }
    })
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
            const taskIndex = this.items.findIndex((e) => e.id === id)
            if (taskIndex > -1) {
              this.items.splice(taskIndex, 1)
            }
          })
      }
    })
  }
}

</script>

<style lang="scss" scoped>

</style>

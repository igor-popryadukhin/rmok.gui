<template>
  <div
    class="task-list fill-height"
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
      <v-list dense>
        <template v-for="(taskItem, taskIndex) in items">
          <v-divider
            v-if="taskIndex > 0"
            :key="`v-divider-${taskIndex}`"
          />
          <v-list-item
            :key="`v-list-item-${taskIndex}`"
            :disabled="tasksCloseProcessIds.indexOf(taskItem.id) > -1"
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
                  <template v-if="taskItem.contact">
                    <template v-if="taskItem.contact.status">
                      <span
                        class="ml-1"
                        :style="{ color: taskItem.contact.status.color }"
                      >
                        [ {{ taskItem.contact.status.name }} ]
                      </span>
                    </template>
                  </template>
                </template>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ taskItem.description }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div class="d-inline-flex">
                <app-confirm-dialog
                  :text="$tc('Are you sure you want to close the task?')"
                  @click:confirm="onBtnTaskItemCloseClick(taskItem.id)"
                >
                  <template #activator="{ on }">
                    <v-btn
                      small
                      icon
                      @click.stop="on.click()"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                </app-confirm-dialog>
              </div>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
      <div class="d-flex justify-center grey--text text-caption">
        <div>
          {{ items.length }} / {{ itemsTotal }}
        </div>
      </div>
      <div
        v-if="itemsTotal >= 30"
        v-intersect="onIntersect"
        class="d-flex align-center justify-center"
        style="height: 200px"
      >
        <app-loading v-if="isIntersecting && itemsFetching" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Task from '@/api/interfaces/Task'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Base from './Base'

import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

// eslint-disable-next-line no-use-before-define
@Component<TasksList>({
  components: {
    AppConfirmDialog: () => import(
      /* webpackChunkName: "app-confirm-dialog" */
      '@/components/AppConfirmDialog/AppConfirmDialog.vue'
      ),
    AppLoading
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$store.dispatch(vm.getVuexModuleNamespace(to) + '/list/fetch')
    })
  },
  beforeRouteUpdate (to, from, next) {
    const isFetching = this.$store.getters[this.getVuexModuleNamespace(to) + '/list/items_fetching']
    const isEmpty = (this.$store.getters[this.getVuexModuleNamespace(to) + '/list/items'] || []).length === 0
    if (isEmpty && !isFetching) {
      this.$store.dispatch(this.getVuexModuleNamespace(to) + '/list/fetch')
    }
    next()
  }
})
export default class TasksList extends Base {
  isIntersecting = false
  tasksCloseProcessIds = []

  @Prop() readonly id!: string
  @Prop({ default: () => null }) readonly planned_for!: string|null

  /**
   * Задачи
   */
  get items (): Task[] {
    return this.$store.getters[this.getVuexModuleNamespace(this.$route) + '/list/items'] || []
  }
  get itemsTotal (): number {
    return this.$store.getters[this.getVuexModuleNamespace(this.$route) + '/list/items_total']
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

  /**
   *
   * @param id
   * @private
   */
  private onBtnTaskItemCloseClick (id: number) {
    this.tasksCloseProcessIds.push(id)
    this.$axios.get(`/tasks/${id}/done`)
      .then((response) => {
        if (response.status === 200) {
          this.$toast.success('The task is closed')
        }
      })
  }

  private onIntersect (entries, observer) {
    this.isIntersecting = entries[0].isIntersecting
    if (this.isIntersecting) {
      this.fetchTasks(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.task-list {}
</style>

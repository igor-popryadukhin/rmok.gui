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
              <v-list-item-subtitle v-if="taskItem.contact">
                <template v-if="taskItem.contact.last_status">
                  <v-chip
                    :color="taskItem.contact.last_status.color"
                    label
                    outlined
                    x-small
                  >
                    {{ taskItem.contact.last_status.name }}
                  </v-chip>
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
  </v-sheet>
</template>

<script lang="ts">
import Task from '@/api/interfaces/Task'
import Tasks from '@/api/Tasks'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Vue from 'vue'

export default Vue.extend({
  components: { AppLoading },

  data () {
    return {
      tasksCloseProcessIds: [] as number[],
      tasksLoadingProcess: false,
      tasks: [] as Task[]
    }
  },

  computed: {
    contactId () {
      return +this.$route.params.contact_id
    }
  },

  mounted () {
    this.fetchTasks()
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

    onBtnTaskItemClick (item: Task) {
      if (item.contact) {
        this.$router.push({
          name: 'contacts_view',
          params: {
            contact_id: String(item.contact.id)
          }
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

<template>
  <s-task-list
    ref="sTaskList"
    :params="taskListParams"
    tools-enabled
    flat
    @loaded-data="onLoadedData"
  >
    <template v-slot:item="{ item }">
      <v-list-item-title
        v-if="item.type === 'call'"
        :style="{ color: item.expired ? 'red' : '' }"
      >
        {{ `Позвонить ${$moment.unix(item.planned_for).format('Do MMMM, dddd, hh:mm:ss a')}` }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ item.description }}
      </v-list-item-subtitle>
    </template>
  </s-task-list>
</template>

<script lang="ts">
import { TaskInterface } from '@/api/Tasks'
import STaskList from '@/snippets/STaskList/STaskList.vue'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'

export default (Vue as VueConstructor<VInterface>).extend({
  components: { STaskList },

  data () {
    return {
      taskCount: 0
    }
  },

  computed: {
    taskListParams () {
      return {
        sort: 'created_desc',
        state: 'all',
        planned_for: 'all',
        contact_id: this.$route.params.contact_id
      }
    },

    itemActions () {
      return [
        {
          title: 'Выполнить'
        }
      ]
    }
  },

  methods: {
    taskItemStyleCompute (item: TaskInterface) {
      const style: any = {}
      if (item.expired) {
        style.opacity = 0.5
      }
      return style
    },

    onLoadedData (data: any) {
      this.$data.taskCount = data.meta.count
    }
  }
})
</script>

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
        {{ `Позвонить ${$moment.unix(item.planned_for).format('Do MMMM, dddd, в HH:mm')}` }}
      </v-list-item-title>
      <v-list-item-subtitle v-if="item.contact">
        {{ item.contact.last_name }} {{ item.contact.first_name }} {{ item.contact.middle_name }}
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        <span
          class="label mr-2"
          :style="{'background-color': lastContactStatus(item.contact).color }"
          :class="lastContactStatus(item.contact).class"
        >
          {{ lastContactStatus(item.contact).name }}
        </span> {{ item.description || '—' }}
      </v-list-item-subtitle>
    </template>
  </s-task-list>
</template>

<script lang="ts">
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import { TaskInterface } from '@/api/Tasks'
import STaskList from '@/snippets/STaskList/STaskList.vue'
import store from '@/store'
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

  beforeRouteEnter (to, from, next) {
    store.commit('tasks/items', [])
    next()
  },

  mounted () {
    this.update()
  },

  methods: {
    /**
     * Метод предназначен для обновления всего компонента
     **/
    update () {
      this.$store.dispatch('tasks/pending_count') // Количество задач в статусе pending
    },

    lastContactStatus (contact: ContactInterface) {
      if (contact) {
        if (contact.last_status) {
          return {
            name: contact.last_status.name,
            class: '',
            color: contact.last_status.color
          }
        }
      }
      return {
        name: this.$tc('Status not set'),
        class: 'label-outlined label-color-grey',
        color: ''
      }
    },

    vListItemStyleComputed (task: TaskInterface) {
      const style: any = {}

      if (this.tabsCurrentValue === 'pending') {
        if (task.state === 'done') {
          style.opacity = 0.5
        }
      }

      return style
    },

    onLoadedData (data: any) {
      this.$data.taskCount = data.meta.count
    }
  }
})
</script>

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
        {{ `Позвонить ${$moment.unix(item.planned_for).format(`Do MMMM, dddd, в ${date_time_format.short_time}`)}` }}
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
  beforeRouteEnter (to, from, next) {
    store.commit('tasks/items', [])
    next()
  },

  components: { STaskList },

  computed: {
    itemActions () {
      return [
        {
          title: 'Выполнить'
        }
      ]
    },

    taskListParams () {
      return {
        contact_id: this.$route.params.contact_id,
        planned_for: 'all',
        sort: 'created_desc',
        state: 'all'
      }
    }
  },

  data () {
    return {
      taskCount: 0
    }
  },

  methods: {

    lastContactStatus (contact: ContactInterface) {
      if (contact) {
        if (contact.last_status) {
          return {
            class: '',
            color: contact.last_status.color,
            name: contact.last_status.name
          }
        }
      }
      return {
        class: 'label-outlined label-color-grey',
        color: '',
        name: this.$tc('Status not set')
      }
    },

    onLoadedData (data: any) {
      this.$data.taskCount = data.meta.count
    },

    /**
     * Метод предназначен для обновления всего компонента
     **/
    update () {
      if (this.$refs.sTaskList) { this.$refs.sTaskList.update() }
    },

    vListItemStyleComputed (task: TaskInterface) {
      const style: any = {}

      if (this.tabsCurrentValue === 'pending') {
        if (task.state === 'done') {
          style.opacity = 0.5
        }
      }

      return style
    }
  },

  mounted () {
    this.update()
  }
})
</script>

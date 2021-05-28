<template>
  <s-task-list
    filters-enabled
  >
    <template v-slot:item="{ item }">
      <v-list-item-title
        :style="{ color: item.expired ? 'red' : '' }"
      >
        {{ `Позвонить ${$moment.unix(item.planned_for).format('Do MMMM, dddd, HH:mm:ss') }` }}
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
import Vue from 'vue'

export default Vue.extend({
  components: { STaskList },

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

    vListItemStyleComputed (task: TaskInterface) {
      const style: any = {}

      if (this.tabsCurrentValue === 'pending') {
        if (task.state === 'done') {
          style.opacity = 0.5
        }
      }

      return style
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

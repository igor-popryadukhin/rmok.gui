<template>
  <s-task-list
    ref="sTaskList"
    flat
  />
</template>

<script lang="ts">
import STaskList from '@/snippets/STaskList/STaskList.vue'
import Vue, { VueConstructor } from 'vue'
import VInterface from '@/VInterface'

export default (Vue as VueConstructor<VInterface>).extend({
  components: { STaskList },

  beforeRouteUpdate (to, from, next) {
    this.$refs.sTaskList.fetchData({
      contact_id: to.params.contact_id
    }).finally(() => {
      next()
    })
  },

  mounted () {
    this.$refs.sTaskList.fetchData()
  }
})
</script>

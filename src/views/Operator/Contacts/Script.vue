<template>
  <div v-html="scenario" > {{ scenario }} </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters({
      project_id: 'project/id',
      scenario: 'project/scenario'
    })
  }
})
</script>

<style scoped>

</style>

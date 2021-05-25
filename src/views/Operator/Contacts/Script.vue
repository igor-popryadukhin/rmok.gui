<template>
  <div v-html="scenario" ></div>
</template>

<script lang="ts">

import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters({
      project_current: 'project/current'
    }),

    scenario () {
      return this.project_current?.scenario || ''
    }
  }
})
</script>

<style scoped>

</style>

<template>
  <div v-html="projectScenario" />
</template>

<script lang="ts">

import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters({
      contactViewProject: 'contact_view/project'
    }),

    projectScenario () {
      return this.contactViewProject?.scenario || ''
    }
  }
})
</script>

<style scoped>

</style>

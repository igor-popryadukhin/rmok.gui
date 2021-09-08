<template>
  <div v-html="projectScenario" />
</template>

<script lang="ts">

import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  props: {
    sex: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      projectScenario: 'project/scenario'
    })
  }
})
</script>

<style scoped>

</style>

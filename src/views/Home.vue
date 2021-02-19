<template>
  <div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  beforeRouteEnter (to, from, next) {
    next({ name: 'operator_leads' })
  }
})
</script>
